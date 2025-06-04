import React from 'react';
import { useAppContext } from '../../app/contexts/AppContext';
import { Sparkles, Loader } from 'lucide-react';

export const GenerateButton: React.FC = () => {
  const { 
    leads,
    pitch: companyContext,
    isGenerating,
    setIsGenerating,
    setProgress,
    setOutputs,
    csvFile
  } = useAppContext();
  
  const canGenerate = leads.length > 0 && companyContext.trim().length > 0 && csvFile !== null;
  
  const handleGenerate = async () => {
    if (!canGenerate || isGenerating) return;
    
    setIsGenerating(true);
    setProgress(0);
    
    try {
      // Create form data to send to API
      const formData = new FormData();
      formData.append('file', csvFile as File);
      formData.append('companyContext', companyContext);
      
      // Call the API endpoint
      const response = await fetch('/api/generatePitch', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      // Get the JSON data from the response
      const data = await response.json();
      
      // Store the CSV data in localStorage for faster downloads
      localStorage.setItem('generatedCSV', data.csv);
      
      // Set the outputs with the results data
      setOutputs(data.results);
      setProgress(100);
    } catch (error) {
      console.error('Error generating pitches:', error);
      // Here you would show an error notification in a real app
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="text-center">
      <button
        onClick={handleGenerate}
        disabled={!canGenerate || isGenerating}
        className={`
          flex items-center justify-center px-6 py-3 rounded-md text-white font-medium text-lg
          transition-colors
          ${
            !canGenerate
              ? 'bg-gray-400 cursor-not-allowed'
              : isGenerating
                ? 'bg-indigo-600 cursor-wait'
                : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
          }
        `}
      >
        {isGenerating ? (
          <>
            <Loader className="animate-spin h-5 w-5 mr-2" />
            Generating Pitches...
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5 mr-2" />
            Generate Personalized Pitches
          </>
        )}
      </button>
    </div>
  );
};