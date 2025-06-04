import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { FileUploader } from './FileUploader';
import { ConfigPanel } from './ConfigPanel';
import { LeadTable } from './LeadTable';
import { GenerateButton } from './GenerateButton';
import { OutputTable } from './OutputTable';
import { ExportOptions } from './ExportOptions';

export const Dashboard: React.FC = () => {
  const { leads, outputs, isValidCSV } = useAppContext();

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Personalize Your B2B Outreach</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Upload your leads, customize your pitch, and generate personalized outreach messages at scale.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-indigo-500 py-3 px-4">
              <h3 className="text-white font-semibold">1. Upload Leads CSV</h3>
            </div>
            <div className="p-4">
              <FileUploader />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-indigo-500 py-3 px-4">
              <h3 className="text-white font-semibold">2. Configure Your Pitch</h3>
            </div>
            <div className="p-4">
              <ConfigPanel />
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          {leads.length > 0 && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-indigo-500 py-3 px-4">
                <h3 className="text-white font-semibold">3. Lead Preview</h3>
              </div>
              <div className="p-4">
                <LeadTable />
              </div>
            </div>
          )}
          
          {isValidCSV && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-indigo-500 py-3 px-4">
                <h3 className="text-white font-semibold">4. Generate Pitches</h3>
              </div>
              <div className="p-4 flex justify-center">
                <GenerateButton />
              </div>
            </div>
          )}
        </div>
      </div>
      
      {outputs.length > 0 && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-indigo-500 py-3 px-4">
              <h3 className="text-white font-semibold">5. Generated Pitches</h3>
            </div>
            <div className="p-4">
              <OutputTable />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-indigo-500 py-3 px-4">
              <h3 className="text-white font-semibold">6. Export</h3>
            </div>
            <div className="p-4">
              <ExportOptions />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};