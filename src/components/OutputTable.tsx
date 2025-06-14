import React from 'react';
import { useAppContext } from '../../app/contexts/AppContext';

export const OutputTable: React.FC = () => {
  const { outputs, isGenerating } = useAppContext();
  
  // Group outputs by groupName
  const groupedOutputs = outputs.reduce((groups: Record<string, typeof outputs>, output) => {
    const groupName = output.groupName || output.data?.groupName || 'Ungrouped';
    if (!groups[groupName]) {
      groups[groupName] = [];
    }
    groups[groupName].push(output);
    return groups;
  }, {});

  // Extract groups with descriptions
  const groups = Object.entries(groupedOutputs).map(([name, leads]) => {
    // Get the description from the first lead's pitch (first line)
    const description = leads[0]?.pitch?.split('\n')[0] || leads[0]?.data?.pitch?.split('\n')[0] || '';
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
          <h2 className="text-xl text-gray-200 font-semibold mb-4">Generated Groups</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groups.map((group, i) => (
              <div key={i} className="bg-[#1e1e1e] p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-200">{group.name}</h3>
                  <span className="text-sm text-gray-200">
                    {group.leads.length} leads
                  </span>
                </div>
                <p className="text-gray-200 text-sm mb-4">{group.description}</p>
                
                {/* Show pitch once per group */}
                {group.leads[0]?.pitch && (
                  <details className="mb-4">
                    <summary className="text-sm text-gray-300 cursor-pointer hover:text-white font-medium">
                      View Group Pitch
                    </summary>
                    <div className="mt-2 text-sm max-h-[10vh] overflow-y-auto text-gray-200 whitespace-pre-wrap bg-zinc-800/50 p-4 rounded-md border border-zinc-700">
                      {group.leads[0]?.pitch}
                    </div>
                  </details>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};