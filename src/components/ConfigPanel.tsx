import React from 'react';
import { useAppContext } from '../../app/contexts/AppContext';

export const ConfigPanel: React.FC = () => {
  const { 
    pitch, 
    setPitch
  } = useAppContext();

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
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 min-h-[120px]"
        />
        <p className="mt-1 text-sm text-gray-500">
          This information will be used to generate personalized pitches for your leads.
        </p>
      </div>
    </div>
  );
};