'use client';

import { useState } from 'react';

interface ProcessedLead {
  id: string;
  fullName: string;
  jobTitle: string;
  companyName: string;
  groupName: string;
  pitch: string;
}

interface Group {
  name: string;
  description: string;
}

interface ProgressState {
  phase: 'idle' | 'starting' | 'classifying' | 'balancing' | 'generating_pitch' | 'complete';
  message: string;
  detail?: string;
  batch?: number;
  totalBatches?: number;
  currentGroup?: string;
  groupProgress?: number;
  totalGroups?: number;
}

export default function TestCSVPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [maxGroups, setMaxGroups] = useState<number>(3);
  const [predefinedGroups, setPredefinedGroups] = useState<string>('');
  const [progress, setProgress] = useState<ProgressState>({ phase: 'idle', message: '' });
  const [groups, setGroups] = useState<Group[]>([]);
  const [processedLeads, setProcessedLeads] = useState<ProcessedLead[]>([]);
  const [csvUrl, setCsvUrl] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setProgress({ phase: 'starting', message: 'Initializing...' });
    setGroups([]);
    setProcessedLeads([]);
    setCsvUrl(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('maxGroups', maxGroups.toString());
      if (predefinedGroups.trim()) {
        formData.append('predefinedGroups', predefinedGroups);
      }
      formData.append('companyContext', `Introducing AxonThistle Solutions – your go-to partner for hyper-specialized services that nobody else even dares to think about. We don't try to be everything to everyone; we aim to be exactly what you didn't know you needed—across sectors as varied as aerospace, agriculture, luxury retail, and marine biology.

      In the aerospace sector, we provide orbital decay forecasting for private satellite operators, using a proprietary blend of machine learning and high-altitude pigeon tracking (don't ask). For agriculture, we offer mood-based irrigation algorithms that adjust watering schedules based on plant stress signals gathered via leaf-surface thermal microvibrations. Yes, it's real, and yes, we invented it.
      
      For luxury retail, our services include scent-memory calibration for flagship stores—ensuring that every customer is subtly reminded of their childhood dreams, increasing conversion rates by up to 0.6%. In urban planning, we design micro-sanctuaries for introverts: spatially optimized benches and alcoves in public spaces that reduce unwanted human interaction by up to 85%.
      
      In the marine biology space, we deliver custom-designed underwater decoy creatures for behavioral studies—complete with programmable emotional states. Meanwhile, for logistics, our warehouse fog-mapping service helps operators predict where fog will form inside large cold-storage units (because that is a problem).
      
      No matter how obscure the challenge, if it's strange, specific, and unsolved—we probably already have a team on it. AxonThistle Solutions: impossibly niche, surprisingly necessary.`);

      const response = await fetch('/api/generatePitch', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload CSV');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const updates = chunk.split('\n').filter(Boolean);

        for (const update of updates) {
          const { type, data } = JSON.parse(update);
          
          switch (type) {
            case 'start':
              setProgress({
                phase: 'starting',
                message: `Processing ${data.totalLeads} leads...`,
                detail: `Target: ${data.maxGroups} groups`
              });
              break;

            case 'progress':
              switch (data.phase) {
                case 'classifying':
                  setProgress({
                    phase: 'classifying',
                    message: 'Classifying leads into groups',
                    detail: `Batch ${data.batch}/${data.totalBatches}`,
                    batch: data.batch,
                    totalBatches: data.totalBatches
                  });
                  break;
                case 'balancing':
                  setProgress({
                    phase: 'balancing',
                    message: 'Optimizing group distribution',
                    detail: `Adjusting from ${data.currentGroups} to ${data.targetGroups} groups`
                  });
                  break;
                case 'generating_pitch':
                  setProgress({
                    phase: 'generating_pitch',
                    message: 'Generating personalized pitches',
                    detail: `Group: ${data.group}`,
                    currentGroup: data.group,
                    groupProgress: data.current,
                    totalGroups: data.total
                  });
                  break;
              }
              break;

            case 'group':
              setGroups(prev => {
                // Replace if exists, add if new
                const exists = prev.findIndex(g => g.name === data.name);
                if (exists >= 0) {
                  return [...prev.slice(0, exists), data, ...prev.slice(exists + 1)];
                }
                return [...prev, data];
              });
              break;

            case 'lead':
              console.log('lead', data); 
              setProcessedLeads(prev => {
                // Replace if exists, add if new
                const exists = prev.findIndex(l => l.id === data.id);
                if (exists >= 0) {
                  return [...prev.slice(0, exists), data, ...prev.slice(exists + 1)];
                }
                return [...prev, data];
              });
              break;

            case 'csv':
              const blob = new Blob([data.content], { type: 'text/csv' });
              const url = window.URL.createObjectURL(blob);
              setCsvUrl(url);
              break;

            case 'complete':
              setProgress({
                phase: 'complete',
                message: 'Processing complete!',
                detail: `${data.totalProcessed} leads processed`
              });
              break;

            case 'error':
              setError(data.message);
              break;
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getProgressBar = () => {
    let percentage = 0;
    switch (progress.phase) {
      case 'classifying':
        percentage = ((progress.batch || 0) / (progress.totalBatches || 1)) * 100;
        break;
      case 'generating_pitch':
        percentage = ((progress.groupProgress || 0) / (progress.totalGroups || 1)) * 100;
        break;
      case 'complete':
        percentage = 100;
        break;
      default:
        percentage = 0;
    }
    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
        <div 
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">CSV Upload Test</h1>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Maximum Number of Groups
          </label>
          <input
            type="number"
            min="1"
            value={maxGroups}
            onChange={(e) => setMaxGroups(Math.max(1, parseInt(e.target.value) || 1))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Predefined Groups (comma-separated)
          </label>
          <input
            type="text"
            value={predefinedGroups}
            onChange={(e) => setPredefinedGroups(e.target.value)}
            placeholder="e.g., Aerospace, Agriculture, Retail"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          <p className="mt-1 text-sm text-gray-500">Leave empty to let the system create groups automatically</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload CSV File
          </label>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>
      </div>

      {(loading || progress.phase !== 'idle') && (
        <div className="mt-6 p-4 bg-white rounded-lg shadow">
          <div className="flex items-center space-x-2 mb-2">
            {loading && <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent" />}
            <h3 className="font-medium">{progress.message}</h3>
          </div>
          {progress.detail && (
            <p className="text-sm text-gray-600 mb-2">{progress.detail}</p>
          )}
          {getProgressBar()}
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center text-red-600">
            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        </div>
      )}

      {groups.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Generated Groups</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groups.map((group, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">{group.name}</h3>
                  <span className="text-sm text-gray-500">
                    {processedLeads.filter(l => l.groupName === group.name).length} leads
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4">{group.description}</p>
                
                {/* Show pitch once per group */}
                {processedLeads.find(lead => lead.groupName === group.name)?.pitch && (
                  <details className="mb-4">
                    <summary className="text-sm text-blue-600 cursor-pointer hover:text-blue-800 font-medium">
                      View Group Pitch
                    </summary>
                    <div className="mt-2 text-sm text-gray-600 whitespace-pre-wrap bg-gray-50 p-4 rounded-md">
                      {processedLeads.find(lead => lead.groupName === group.name)?.pitch}
                    </div>
                  </details>
                )}

                {/* Show leads list */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Leads in this group:</h4>
                  {processedLeads
                    .filter(lead => lead.groupName === group.name)
                    .map(lead => (
                      <div key={lead.id} className="p-3 bg-gray-50 rounded-md">
                        {Object.entries(lead)
                          .filter(([key]) => !['id', 'groupName', 'pitch'].includes(key)) // Exclude these since they're redundant in this context
                          .map(([key, value]) => (
                            <div key={key} className="mb-1">
                              <span className="font-medium text-gray-700">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}: </span>
                              <span className="text-gray-600">{value}</span>
                            </div>
                          ))}
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {csvUrl && (
        <div className="mt-6 flex justify-center">
          <a
            href={csvUrl}
            download="generated_pitches.csv"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download CSV
          </a>
        </div>
      )}
    </div>
  );
}