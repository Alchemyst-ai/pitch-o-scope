import React, { useRef, useState, useMemo } from 'react';
import { useAppContext } from '../../app/contexts/AppContext';
import { Upload, FileWarning, CheckCircle, AlertTriangle, Download } from 'lucide-react';
import { getTemplateCSV } from '../utils/csvUtils';

export const FileUploader: React.FC = () => {
  const { 
    handleFileUpload,
    csvFile,
    isValidCSV,
    csvError,
    leads
  } = useAppContext();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Get the first few columns from the leads data
  const previewColumns = useMemo(() => {
    if (leads.length === 0) return [];
    
    // Get all properties from the first lead object (excluding internal fields)
    const firstLead = leads[0];
    const columns = Object.keys(firstLead)
      .filter(key => key !== 'id' && key !== 'keywords');
    
    // Return only the first 3 columns (or fewer if there are less)
    return columns.slice(0, 3);
  }, [leads]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };
  
  const downloadTemplate = () => {
    const csvContent = getTemplateCSV();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leads_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-4">
      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging 
            ? 'border-indigo-500 bg-indigo-50' 
            : isValidCSV 
              ? 'border-green-500 bg-transparent' 
              : csvFile && !isValidCSV 
                ? 'border-red-500 bg-red-50'
                : 'border-gray-300 hover:border-indigo-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".csv"
          onChange={handleFileChange}
        />
        
        <div className="flex flex-col items-center justify-center space-y-3">
          {!csvFile ? (
            <>
              <Upload className="h-12 w-12 text-indigo-500" />
              <div>
                <p className="text-gray-700 font-medium">Drag & drop your CSV file here</p>
                <p className="text-gray-500 text-sm mt-1">or click to browse</p>
              </div>
            </>
          ) : isValidCSV ? (
            <>
              <div className="bg-green-500/10 border border-green-500/20 rounded-full p-2">
                <CheckCircle className="h-12 w-12 text-green-700" />
              </div>
              <div>
                <p className="text-green-700 font-medium">{csvFile.name}</p>
                <p className="text-green-600 text-sm mt-1">{leads.length} leads loaded successfully</p>
              </div>
            </>
          ) : (
            <>
              <FileWarning className="h-12 w-12 text-red-500" />
              <div>
                <p className="text-red-700 font-medium">Invalid CSV file</p>
                <p className="text-red-600 text-sm mt-1">{csvError}</p>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* {csvFile && isValidCSV && leads.length > 0 && (
        <div className="mt-4 border rounded-md overflow-hidden">
          <h4 className="bg-gray-100 px-3 py-2 text-sm font-medium">Preview (first 5 leads)</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {previewColumns.map(column => (
                    <th key={column} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leads.slice(0, 5).map((lead) => (
                  <tr key={lead.id}>
                    {previewColumns.map(column => (
                      <td key={`${lead.id}-${column}`} className="px-3 py-2 text-sm text-gray-600">
                        {(lead as any)[column] || ''}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-gray-50 px-3 py-2 text-sm text-gray-500 text-right">
            Showing 5 of {leads.length} leads
          </div>
        </div>
      )} */}
    </div>
  );
};