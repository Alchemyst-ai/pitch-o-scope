import React, { useRef, useState } from 'react';
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
              ? 'border-green-500 bg-green-50' 
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
              <CheckCircle className="h-12 w-12 text-green-500" />
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
      
      {csvFile && isValidCSV && leads.length > 0 && (
        <div className="mt-4 border rounded-md overflow-hidden">
          <h4 className="bg-gray-100 px-3 py-2 text-sm font-medium">Preview (first 5 leads)</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leads.slice(0, 5).map((lead) => (
                  <tr key={lead.id}>
                    <td className="px-3 py-2 text-sm text-gray-800">{lead.fullName}</td>
                    <td className="px-3 py-2 text-sm text-gray-600">{lead.jobTitle}</td>
                    <td className="px-3 py-2 text-sm text-gray-600">{lead.companyName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-gray-50 px-3 py-2 text-sm text-gray-500 text-right">
            Showing 5 of {leads.length} leads
          </div>
        </div>
      )}
    </div>
  );
};