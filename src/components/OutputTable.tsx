import React, { useState } from 'react';
import { useAppContext } from '../../app/contexts/AppContext';
import { ChevronDown, ChevronUp, Edit, Save, X, Copy, CheckCircle } from 'lucide-react';

export const OutputTable: React.FC = () => {
  const { outputs, setOutputs } = useAppContext();
  
  const [expandedOutputs, setExpandedOutputs] = useState<string[]>([]);
  const [editingOutput, setEditingOutput] = useState<string | null>(null);
  const [editedMessage, setEditedMessage] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const toggleExpand = (id: string) => {
    if (expandedOutputs.includes(id)) {
      setExpandedOutputs(expandedOutputs.filter(outputId => outputId !== id));
    } else {
      setExpandedOutputs([...expandedOutputs, id]);
    }
  };
  
  const startEditing = (id: string, message: string) => {
    setEditingOutput(id);
    setEditedMessage(message);
  };
  
  const saveEdit = (id: string) => {
    setOutputs(outputs.map(output => 
      output.id === id 
        ? { ...output, personalizedMessage: editedMessage }
        : output
    ));
    setEditingOutput(null);
  };
  
  const cancelEdit = () => {
    setEditingOutput(null);
  };
  
  const copyToClipboard = (id: string, message: string) => {
    navigator.clipboard.writeText(message).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-md">
        {outputs.length > 0 ? (
          outputs.map((output) => (
            <div 
              key={output.id} 
              className="border-b last:border-b-0"
            >
              <div 
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => toggleExpand(output.id)}
              >
                <div className="flex-grow">
                  <div className="flex items-center">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{output.lead.fullName}</h4>
                      <p className="text-sm text-gray-600">
                        {output.lead.jobTitle} at {output.lead.companyName}
                      </p>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {output.outputType}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center ml-4">
                  {expandedOutputs.includes(output.id) ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>
              
              {expandedOutputs.includes(output.id) && (
                <div className="p-4 bg-gray-50 border-t">
                  <div className="mb-3">
                    <h5 className="text-sm font-medium text-gray-700 mb-1">Pitch Angle</h5>
                    <p className="text-sm text-gray-800 bg-white p-3 rounded border">
                      {output.pitchAngle}
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="text-sm font-medium text-gray-700">Personalized Message</h5>
                      <div className="flex space-x-2">
                        {editingOutput === output.id ? (
                          <>
                            <button 
                              onClick={() => saveEdit(output.id)}
                              className="flex items-center text-green-600 hover:text-green-800 text-xs"
                            >
                              <Save className="h-3.5 w-3.5 mr-1" />
                              Save
                            </button>
                            <button 
                              onClick={cancelEdit}
                              className="flex items-center text-red-600 hover:text-red-800 text-xs"
                            >
                              <X className="h-3.5 w-3.5 mr-1" />
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              onClick={() => copyToClipboard(output.id, output.personalizedMessage)}
                              className="flex items-center text-indigo-600 hover:text-indigo-800 text-xs"
                            >
                              {copiedId === output.id ? (
                                <>
                                  <CheckCircle className="h-3.5 w-3.5 mr-1" />
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3.5 w-3.5 mr-1" />
                                  Copy
                                </>
                              )}
                            </button>
                            <button 
                              onClick={() => startEditing(output.id, output.personalizedMessage)}
                              className="flex items-center text-indigo-600 hover:text-indigo-800 text-xs"
                            >
                              <Edit className="h-3.5 w-3.5 mr-1" />
                              Edit
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {editingOutput === output.id ? (
                      <textarea
                        value={editedMessage}
                        onChange={(e) => setEditedMessage(e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 min-h-[120px]"
                      />
                    ) : (
                      <div className="whitespace-pre-wrap text-sm text-gray-800 bg-white p-3 rounded border">
                        {output.personalizedMessage}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-gray-500">
            No pitches generated yet. Configure your settings and click "Generate Pitches".
          </div>
        )}
      </div>
    </div>
  );
};