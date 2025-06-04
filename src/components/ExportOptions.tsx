import React, { useState } from 'react';
import { useAppContext } from '../../app/contexts/AppContext';
import { FileDown, ClipboardCopy, CheckCircle } from 'lucide-react';
import { outputsToCSV } from '../utils/pitchUtils';

export const ExportOptions: React.FC = () => {
  const { outputs } = useAppContext();
  const [isCopied, setIsCopied] = useState(false);
  
  const exportToCSV = () => {
    const csv = outputsToCSV(outputs);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pitches_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
        className="flex items-center px-4 py-2 border border-indigo-600 rounded-md text-indigo-600 hover:bg-indigo-50 transition-colors"
      >
        <FileDown className="h-5 w-5 mr-2" />
        Download CSV
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