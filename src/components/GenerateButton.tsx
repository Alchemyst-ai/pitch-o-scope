import React, { useState } from 'react';
import { useAppContext } from '../../app/contexts/AppContext';
import { Sparkles, Loader, Download } from 'lucide-react';
import { parseUntilJson } from '../functions/utils/parseUntilJson';
import { Button } from '../../app/components/ui';
import { theme } from '../../app/utils/theme';

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

export const GenerateButton: React.FC = () => {
  const { 
    leads,
    pitch: companyContext,
    isGenerating,
    setIsGenerating,
    setOutputs,
    csvFile,
    isGroupingEnabled,
    numberOfGroups,
    predefinedGroups
  } = useAppContext();
  
  const [progress, setProgress] = useState<ProgressState>({ phase: 'idle', message: '' });
  const [error, setError] = useState<string | null>(null);
  const [groups, setGroups] = useState<{ name: string; description: string }[]>([]);
  const [processedLeads, setProcessedLeads] = useState<any[]>([]);
  const [csvUrl, setCsvUrl] = useState<string | null>(null);
  
  const canGenerate = leads.length > 0 && companyContext.trim().length > 0 && csvFile !== null;
  
  const handleGenerate = async () => {
    if (!canGenerate || isGenerating) return;
    
    setIsGenerating(true);
    setProgress({ phase: 'starting', message: 'Initializing...' });
    setError(null);
    setGroups([]);
    setProcessedLeads([]);
    setCsvUrl(null);
    
    try {
      // Create form data to send to API
      const formData = new FormData();
      formData.append('file', csvFile as File);
      formData.append('companyContext', companyContext);
      
      if (isGroupingEnabled) {
        formData.append('maxGroups', numberOfGroups.toString());
        if (predefinedGroups.trim()) {
          formData.append('predefinedGroups', predefinedGroups);
        }
      }
      
      // Call the API endpoint with streaming response
      const response = await fetch('/api/generatePitch', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const updates = chunk.split('\n').filter(Boolean);

        for (const update of updates) {
          try {
            const { type, data } = parseUntilJson(update);
            
            switch (type) {
              case 'start':
                setProgress({
                  phase: 'starting',
                  message: `Processing ${data.totalLeads} leads...`,
                  detail: `Target: ${data.maxGroups} groups`
                });
                break;

              case 'progress':
                setProgress({
                  phase: data.phase,
                  message: getMessageForPhase(data.phase),
                  detail: getDetailForPhase(data),
                  batch: data.batch,
                  totalBatches: data.totalBatches,
                  currentGroup: data.group,
                  groupProgress: data.current,
                  totalGroups: data.total
                });
                break;

              case 'group':
                setGroups(prev => {
                  const exists = prev.findIndex(g => g.name === data.name);
                  if (exists >= 0) {
                    return [...prev.slice(0, exists), data, ...prev.slice(exists + 1)];
                  }
                  return [...prev, data];
                });
                break;

              case 'lead':
                setProcessedLeads(prev => {
                  const exists = prev.findIndex(l => l.id === data.id);
                  if (exists >= 0) {
                    return [...prev.slice(0, exists), data, ...prev.slice(exists + 1)];
                  }
                  return [...prev, data];
                });
                // Update outputs in real-time so they appear in the results section
                setOutputs(current => {
                  const exists = current.findIndex(l => l.id === data.id);
                  if (exists >= 0) {
                    return [...current.slice(0, exists), data, ...current.slice(exists + 1)];
                  }
                  return [...current, data];
                });
                break;

              case 'csv':
                // Create a downloadable URL for the CSV
                const blob = new Blob([data.content], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                setCsvUrl(url);
                localStorage.setItem('generatedCSV', data.content);
                break;

              case 'complete':
                setProgress({
                  phase: 'complete',
                  message: 'Processing complete!',
                  detail: `${data.totalProcessed || processedLeads.length} leads processed`
                });
                break;

              case 'error':
                setError(data.message);
                break;
            }
          } catch (err) {
            console.error('Error parsing update:', err, update);
          }
        }
      }
    } catch (error) {
      console.error('Error generating pitches:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const getMessageForPhase = (phase: string): string => {
    switch (phase) {
      case 'classifying': return 'Classifying leads into groups';
      case 'balancing': return 'Optimizing group distribution';
      case 'generating_pitch': return 'Generating personalized pitches';
      case 'complete': return 'Processing complete!';
      default: return 'Processing...';
    }
  };

  const getDetailForPhase = (data: any): string => {
    switch (data.phase) {
      case 'classifying':
        return `Batch ${data.batch}/${data.totalBatches}`;
      case 'balancing':
        return `Adjusting from ${data.currentGroups} to ${data.targetGroups} groups`;
      case 'generating_pitch':
        return `Group: ${data.group}`;
      default:
        return '';
    }
  };

  const getProgressPercentage = (): number => {
    switch (progress.phase) {
      case 'classifying':
        return ((progress.batch || 0) / (progress.totalBatches || 1)) * 100;
      case 'generating_pitch':
        return ((progress.groupProgress || 0) / (progress.totalGroups || 1)) * 100;
      case 'complete':
        return 100;
      default:
        return 0;
    }
  };

  return (
    <div className="text-center space-y-4">
      <Button
        onClick={handleGenerate}
        disabled={!canGenerate || isGenerating}
        fullWidth
        className={`
          flex items-center justify-center py-3 text-lg
          ${!canGenerate ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {isGenerating ? (
          <>
            <Loader className="animate-spin h-5 w-5 mr-2" />
            Processing...
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5 mr-2" />
            Generate Personalized Pitches
          </>
        )}
      </Button>

      {isGenerating && (
        <div className={`mt-6 p-4 ${theme.glassCard} rounded-lg`}>
          <div className="flex items-center space-x-2 mb-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-orange-500 border-t-transparent" />
            <h3 className="font-medium text-white">{progress.message}</h3>
          </div>
          {progress.detail && (
            <p className="text-sm text-gray-300 mb-2">{progress.detail}</p>
          )}
          <div className="w-full bg-gray-800/50 rounded-full h-2.5 mb-4">
            <div 
              className="bg-gradient-to-r from-[#dbb13d] to-[#f04848] h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
        </div>
      )}

      {csvUrl && (
        <div className="mt-4 flex justify-center">
          <a
            href={csvUrl}
            download="generated_pitches.csv"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Download className="h-5 w-5 mr-2" />
            Download CSV
          </a>
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
    </div>
  );
};