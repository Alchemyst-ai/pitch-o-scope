import React from 'react';
import { useAppContext } from '../../app/contexts/AppContext';
import { FileUploader } from './FileUploader';
import { ConfigPanel } from './ConfigPanel';
import { LeadTable } from './LeadTable';
import { GenerateButton } from './GenerateButton';
import { OutputTable } from './OutputTable';
import { ExportOptions } from './ExportOptions';
import { CSVRenderer } from './CSVRenderer';

export const Dashboard: React.FC = () => {
  const { leads, outputs, isValidCSV, isGenerating, csvFile } = useAppContext();

  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Personalize Your B2B Outreach</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Upload your leads, customize your pitch, and generate personalized outreach messages at scale.
        </p>
      </div>
      
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-indigo-500 py-3 px-4">
            <h3 className="text-white font-semibold">1. Upload Leads CSV</h3>
          </div>
          <div className="p-4">
            <FileUploader />
          </div>
        </div>
        
        {csvFile && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-indigo-500 py-3 px-4">
              <h3 className="text-white font-semibold">2. Raw CSV Data</h3>
            </div>
            <div className="p-4">
              <CSVRenderer />
            </div>
          </div>
        )}
        
        {csvFile && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-indigo-500 py-3 px-4">
              <h3 className="text-white font-semibold">4. Configure Your Pitch</h3>
            </div>
            <div className="p-4">
              <ConfigPanel />
            </div>
          </div>
        )}
        
        {isValidCSV && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-indigo-500 py-3 px-4">
              <h3 className="text-white font-semibold">5. Generate Pitches</h3>
            </div>
            <div className="p-4">
              <GenerateButton />
            </div>
          </div>
        )}
        
        {(outputs.length > 0 || isGenerating) && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-indigo-500 py-3 px-4">
              <h3 className="text-white font-semibold">6. Results</h3>
            </div>
            <div className="p-4">
              <OutputTable />
              {outputs.length > 0 && !isGenerating && (
                <div className="mt-6 flex justify-center">
                  <ExportOptions />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};