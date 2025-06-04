import React, { useState } from 'react';
import { useAppContext } from '../../app/contexts/AppContext';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ExportOptions } from './ExportOptions';

export const OutputTable: React.FC = () => {
  const { outputs } = useAppContext();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  const toggleExpand = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-md">
        {outputs.length > 0 ? (
          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Generated Pitches</h3>
            <p className="text-gray-600 mb-4">
              Successfully generated {outputs.length} personalized pitches. 
              Click on any card to view the full pitch.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {outputs.map((output) => (
                <div key={output.id} className="border rounded-md overflow-hidden">
                  <div 
                    className="p-4 bg-gray-50 cursor-pointer flex justify-between items-center"
                    onClick={() => toggleExpand(output.id)}
                  >
                    <div>
                      <h4 className="font-medium text-gray-900">{output.fullName}</h4>
                      <p className="text-sm text-gray-600">{output.jobTitle} at {output.companyName}</p>
                      <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {output.groupName}
                      </span>
                    </div>
                    {expandedId === output.id ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  
                  {expandedId === output.id && (
                    <div className="p-4 border-t">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Personalized Pitch</h5>
                      <div className="whitespace-pre-wrap text-sm text-gray-800">
                        {output.pitch}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            No pitches generated yet. Configure your settings and click "Generate Personalized Pitches".
          </div>
        )}
      </div>
    </div>
  );
};