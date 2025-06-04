import React, { useState } from 'react';
import { useAppContext } from '../../app/contexts/AppContext';
import { FileDown, ClipboardCopy, CheckCircle } from 'lucide-react';

export const ExportOptions: React.FC = () => {
  const { outputs, csvFile, pitch: companyContext } = useAppContext();
  const [isCopied, setIsCopied] = useState(false);
  
  const exportToCSV = () => {
    // Get the CSV data from localStorage
    const csvData = localStorage.getItem('generatedCSV');
    
    if (!csvData) {
      console.error('No CSV data found in localStorage');
      return;
    }
    
    // Create a download link
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'output.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const copyAllToClipboard = () => {
    const messages = outputs.map(output => 
      `${output.lead.fullName} (${output.lead.companyName}):\n${output.personalizedMessage}\n\n`
    ).join('');
    
    navigator.clipboard.writeText(messages).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="flex flex-wrap justify-center gap-4">
      <button
        onClick={exportToCSV}
        className="flex items-center px-6 py-3 bg-indigo-600 rounded-md text-white hover:bg-indigo-700 transition-colors"
      >
        <FileDown className="h-5 w-5 mr-2" />
        Download Complete CSV
      </button>
      
      <button
        onClick={copyAllToClipboard}
        className="flex items-center px-4 py-2 bg-indigo-600 rounded-md text-white hover:bg-indigo-700 transition-colors"
      >
        {isCopied ? (
          <>
            <CheckCircle className="h-5 w-5 mr-2" />
            Copied to Clipboard!
          </>
        ) : (
          <>
            <ClipboardCopy className="h-5 w-5 mr-2" />
            Copy All to Clipboard
          </>
        )}
      </button>
    </div>
  );
};