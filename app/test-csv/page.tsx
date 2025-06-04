'use client';

import { useState } from 'react';

export default function TestCSVPage() {
  const [csvContent, setCsvContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
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

      // Get the CSV content from the response
      const csvText = await response.text();
      setCsvContent(csvText);

      // Create and trigger download of the CSV file
      const blob = new Blob([csvText], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'generated_pitches.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">CSV Upload Test</h1>
      
      <div className="mb-8">
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

      {loading && (
        <div className="text-gray-600">Loading...</div>
      )}

      {error && (
        <div className="text-red-600 mb-4">{error}</div>
      )}

      {csvContent && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Generated CSV Content:</h2>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
            {csvContent}
          </pre>
        </div>
      )}
    </div>
  );
}