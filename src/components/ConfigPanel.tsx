import React from 'react';
import { useAppContext } from '../../app/contexts/AppContext';

export const ConfigPanel: React.FC = () => {
  const { 
    pitch, 
    setPitch,
    leads,
    isGroupingEnabled,
    setIsGroupingEnabled,
    numberOfGroups,
    setNumberOfGroups,
    predefinedGroups,
    setPredefinedGroups
  } = useAppContext();

  // Calculate max number of groups based on leads
  const maxGroups = Math.max(10, leads.length);
  // Minimum number of groups is 1
  const minGroups = 1;

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="pitch" className="block text-sm font-medium text-gray-700 mb-1">
          Your Company Context
        </label>
        <textarea
          id="pitch"
          value={pitch}
          onChange={(e) => setPitch(e.target.value)}
          placeholder="Describe your company, products, and unique value proposition..."
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 min-h-[120px] p-4"
        />
        <p className="mt-1 text-sm text-gray-500">
          This information will be used to generate personalized pitches for your leads.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <label htmlFor="groupingToggle" className="text-sm font-medium text-gray-700">
          Enable Lead Grouping
        </label>
        <button
          type="button"
          onClick={() => setIsGroupingEnabled(!isGroupingEnabled)}
          className={`${
            isGroupingEnabled ? 'bg-indigo-600' : 'bg-gray-200'
          } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
          role="switch"
          aria-checked={isGroupingEnabled}
        >
          <span className="sr-only">{"Advanced Grouping (Default is 3 Groups)"}</span>
          <span
            aria-hidden="true"
            className={`${
              isGroupingEnabled ? 'translate-x-5' : 'translate-x-0'
            } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
          />
        </button>
      </div>

      {isGroupingEnabled && (
        <div className="space-y-4">
          <div>
            <label htmlFor="numberOfGroups" className="block text-sm font-medium text-gray-700 mb-1">
              Number of Groups: {numberOfGroups}
            </label>
            <input
              id="numberOfGroups"
              type="range"
              min={minGroups}
              max={maxGroups}
              value={numberOfGroups}
              onChange={(e) => setNumberOfGroups(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <p className="mt-1 text-sm text-gray-500">
              Adjust the number of groups to organize your leads (min: {minGroups}, max: {maxGroups})
            </p>
          </div>

          <div>
            <label htmlFor="predefinedGroups" className="block text-sm font-medium text-gray-700 mb-1">
              Predefined Groups (comma-separated)
            </label>
            <input
              id="predefinedGroups"
              type="text"
              value={predefinedGroups}
              onChange={(e) => setPredefinedGroups(e.target.value)}
              placeholder="e.g., Aerospace, Agriculture, Retail"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              Leave empty to let the system create groups automatically
            </p>
          </div>
        </div>
      )}
    </div>
  );
};