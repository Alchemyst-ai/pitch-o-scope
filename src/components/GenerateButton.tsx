import React from 'react';
import { useAppContext } from '../../app/contexts/AppContext';
import { Sparkles, Loader } from 'lucide-react';
import { generatePitches } from '../utils/pitchUtils';

export const GenerateButton: React.FC = () => {
  const { 
    leads,
    pitch,
    outputType,
    isGroupingEnabled,
    isGenerating,
    setIsGenerating,
    setProgress,
    setOutputs,
    maxPitchLength,
    includeSocialLinks
  } = useAppContext();
  
  const canGenerate = leads.length > 0 && pitch.trim().length > 0 && outputType.length > 0;
  
  const handleGenerate = async () => {
    if (!canGenerate || isGenerating) return;
    
    setIsGenerating(true);
    setProgress(0);
    
    try {
      const outputs = await generatePitches(
        leads,
        pitch,
        outputType,
        (progress) => setProgress(progress),
        maxPitchLength,
        includeSocialLinks
      );
      
      setOutputs(outputs);
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