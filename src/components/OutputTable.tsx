import React from 'react';
import { useAppContext } from '../../app/contexts/AppContext';

export const OutputTable: React.FC = () => {
  const { outputs, isGenerating } = useAppContext();
  
  // Group outputs by groupName
  const groupedOutputs = outputs.reduce((groups: Record<string, typeof outputs>, output) => {
    const groupName = output.groupName || 'Ungrouped';
    if (!groups[groupName]) {
      groups[groupName] = [];
    }
    groups[groupName].push(output);
    return groups;
  }, {});

  // Extract groups with descriptions
  const groups = Object.entries(groupedOutputs).map(([name, leads]) => {
    // Get the description from the first lead's pitch (first line)
    const description = leads[0]?.pitch?.split('\n')[0] || '';
    return { name, description, leads };
  });

  if (groups.length === 0 && !isGenerating) {
    return (
      <div className="p-6 text-center text-gray-500">
        No pitches generated yet. Configure your settings and click "Generate Personalized Pitches".
      </div>
    );
  }

  return (
    <div>
      {groups.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Generated Groups</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groups.map((group, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">{group.name}</h3>
                  <span className="text-sm text-gray-500">
                    {group.leads.length} leads
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4">{group.description}</p>
                
                {/* Show pitch once per group */}
                {group.leads[0]?.pitch && (
                  <details className="mb-4">
                    <summary className="text-sm text-blue-600 cursor-pointer hover:text-blue-800 font-medium">
                      View Group Pitch
                    </summary>
                    <div className="mt-2 text-sm text-gray-600 whitespace-pre-wrap bg-gray-50 p-4 rounded-md">
                      {group.leads[0]?.pitch}
                    </div>
                  </details>
                )}

                {/* Show leads list */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Leads in this group:</h4>
                  {group.leads.map(lead => (
                    <div key={lead.id} className="p-3 bg-gray-50 rounded-md">
                      <div className="mb-1">
                        <span className="font-medium text-gray-700">full name: </span>
                        <span className="text-gray-600">{lead.fullName}</span>
                      </div>
                      <div className="mb-1">
                        <span className="font-medium text-gray-700">job title: </span>
                        <span className="text-gray-600">{lead.jobTitle}</span>
                      </div>
                      <div className="mb-1">
                        <span className="font-medium text-gray-700">company name: </span>
                        <span className="text-gray-600">{lead.companyName}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};