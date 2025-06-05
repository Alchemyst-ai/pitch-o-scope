'use client';

import { useState } from 'react';

export default function TestCSVPage() {
  const [csvContent, setCsvContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [maxGroups, setMaxGroups] = useState<number>(10);
  const [predefinedGroups, setPredefinedGroups] = useState<string>('');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

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

      const data = await response.json();
      
      // Create and trigger download of the CSV file
      const blob = new Blob([data.csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'generated_pitches.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Display the results in a more structured way
      setCsvContent(JSON.stringify(data.results, null, 2));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
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

      {loading && (
        <div className="mt-4 text-gray-600">Processing leads and generating pitches...</div>
      )}

      {error && (
        <div className="mt-4 text-red-600 mb-4">{error}</div>
      )}

      {csvContent && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Generated Results:</h2>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-auto whitespace-pre-wrap">
            {csvContent}
          </pre>
        </div>
      )}
    </div>
  );
}