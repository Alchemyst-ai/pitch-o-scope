import React from 'react';
import { useAppContext } from '../../app/contexts/AppContext';
import { ChevronDown, ChevronUp, Settings } from 'lucide-react';
import { OutputType } from '../types';

export const ConfigPanel: React.FC = () => {
  const { 
    pitch, 
    setPitch, 
    outputType, 
    setOutputType, 
    isGroupingEnabled, 
    setIsGroupingEnabled,
    isAdvancedSettingsOpen,
    setIsAdvancedSettingsOpen,
    maxPitchLength,
    setMaxPitchLength,
    includeSocialLinks,
    setIncludeSocialLinks
  } = useAppContext();

  const toggleOutputType = (type: OutputType) => {
    if (outputType.includes(type)) {
      // Don't allow removing the last output type
      if (outputType.length > 1) {
        setOutputType(outputType.filter(t => t !== type));
      }
    } else {
      setOutputType([...outputType, type]);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="pitch" className="block text-sm font-medium text-gray-700 mb-1">
          Your Startup's Pitch
        </label>
        <textarea
          id="pitch"
          value={pitch}
          onChange={(e) => setPitch(e.target.value)}
          placeholder="We help fintechs accelerate KYC conversion with a no-code, plug-and-play verification flow..."
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 min-h-[120px]"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Choose Message Format
        </label>
        <div className="flex flex-wrap gap-3">
          {Object.values(OutputType).map((type) => (
            <button
              key={type}
              onClick={() => toggleOutputType(type)}
              className={`px-4 py-2 rounded-md transition-colors ${
                outputType.includes(type)
                  ? 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                  : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex items-center">
        <label className="inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            className="sr-only peer"
            checked={isGroupingEnabled}
            onChange={() => setIsGroupingEnabled(!isGroupingEnabled)}
          />
          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          <span className="ms-3 text-sm font-medium text-gray-700">Enable Auto-Grouping (by industry)</span>
        </label>
      </div>
      
      <div className="border-t pt-3 mt-3">
        <button
          onClick={() => setIsAdvancedSettingsOpen(!isAdvancedSettingsOpen)}
          className="flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          <Settings className="h-4 w-4 mr-1" />
          Advanced Settings
          {isAdvancedSettingsOpen ? (
            <ChevronUp className="h-4 w-4 ml-1" />
          ) : (
            <ChevronDown className="h-4 w-4 ml-1" />
          )}
        </button>
        
        {isAdvancedSettingsOpen && (
          <div className="mt-3 space-y-3 pl-5 border-l-2 border-gray-200">
            <div>
              <label htmlFor="maxLength" className="block text-sm font-medium text-gray-700 mb-1">
                Max Pitch Length ({maxPitchLength} characters)
              </label>
              <input
                id="maxLength"
                type="range"
                min="100"
                max="1000"
                step="50"
                value={maxPitchLength}
                onChange={(e) => setMaxPitchLength(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div className="flex items-center">
              <label className="inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={includeSocialLinks}
                  onChange={() => setIncludeSocialLinks(!includeSocialLinks)}
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                <span className="ms-3 text-sm font-medium text-gray-700">Include social links in pitch</span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};