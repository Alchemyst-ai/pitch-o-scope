import React from 'react';
import { useAppContext } from '../../app/contexts/AppContext';
import { FileUploader } from './FileUploader';
import { ConfigPanel } from './ConfigPanel';
import { LeadTable } from './LeadTable';
import { GenerateButton } from './GenerateButton';
import { OutputTable } from './OutputTable';
import { ExportOptions } from './ExportOptions';
import { CSVRenderer } from './CSVRenderer';
import { Card, GradientText } from '../../app/components/ui';
import { theme, combineClasses } from '../../app/utils/theme';

export const Dashboard: React.FC = () => {
  const { leads, outputs, isValidCSV, isGenerating, csvFile } = useAppContext();

  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="text-center mb-8">
        <GradientText as="h2" className="text-3xl mb-2">Personalize Your B2B Outreach</GradientText>
        <p className={theme.bodyText + " max-w-2xl mx-auto"}>
          Upload your leads, customize your pitch, and generate personalized outreach messages at scale.
        </p>
      </div>
      
      <div className="space-y-6">
        <Card>
          <div className="bg-[#1e1e1e] py-3 px-4 rounded-t-xl -mt-6 -mx-6 mb-4">
            <h3 className="text-[#EAEAEA] font-semibold">1. Upload Leads CSV</h3>
          </div>
          <div className="p-4">
            <FileUploader />
          </div>
        </Card>
        
        {csvFile && (
          <Card>
            <div className="bg-[#1e1e1e] py-3 px-4 rounded-t-xl -mt-6 -mx-6 mb-4">
              <h3 className="text-[#EAEAEA] font-semibold">2. Raw CSV Data</h3>
            </div>
            <div className="p-4">
              <CSVRenderer />
            </div>
          </Card>
        )}
        
        {csvFile && (
          <Card>
            <div className="bg-[#1e1e1e] py-3 px-4 rounded-t-xl -mt-6 -mx-6 mb-4">
              <h3 className="text-[#EAEAEA] font-semibold">4. Configure Your Pitch</h3>
            </div>
            <div className="p-4">
              <ConfigPanel />
            </div>
          </Card>
        )}
        
        {isValidCSV && (
          <Card>
            <div className="bg-[#1e1e1e] py-3 px-4 rounded-t-xl -mt-6 -mx-6 mb-4">
              <h3 className="text-[#EAEAEA] font-semibold">5. Generate Pitches</h3>
            </div>
            <div className="p-4">
              <GenerateButton />
            </div>
          </Card>
        )}
        
        {(outputs.length > 0 || isGenerating) && (
          <Card>
            <div className="bg-[#1e1e1e] py-3 px-4 rounded-t-xl -mt-6 -mx-6 mb-4">
              <h3 className="text-[#EAEAEA] font-semibold">6. Results</h3>
            </div>
            <div className="p-4">
              <OutputTable />
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};