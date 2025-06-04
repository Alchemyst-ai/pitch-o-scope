'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Lead, PitchOutput, OutputType } from '../../src/types';
import { parseCSV, validateCSV } from '../../src/utils/csvUtils';

interface AppContextType {
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  csvFile: File | null;
  setCsvFile: React.Dispatch<React.SetStateAction<File | null>>;
  isValidCSV: boolean;
  setIsValidCSV: React.Dispatch<React.SetStateAction<boolean>>;
  csvError: string | null;
  setCsvError: React.Dispatch<React.SetStateAction<string | null>>;
  pitch: string;
  setPitch: React.Dispatch<React.SetStateAction<string>>;
  outputType: OutputType[];
  setOutputType: React.Dispatch<React.SetStateAction<OutputType[]>>;
  isGroupingEnabled: boolean;
  setIsGroupingEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  isGenerating: boolean;
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
  progress: number;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
  outputs: PitchOutput[];
  setOutputs: React.Dispatch<React.SetStateAction<PitchOutput[]>>;
  handleFileUpload: (file: File) => Promise<void>;
  isAdvancedSettingsOpen: boolean;
  setIsAdvancedSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  maxPitchLength: number;
  setMaxPitchLength: React.Dispatch<React.SetStateAction<number>>;
  includeSocialLinks: boolean;
  setIncludeSocialLinks: React.Dispatch<React.SetStateAction<boolean>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isValidCSV, setIsValidCSV] = useState<boolean>(false);
  const [csvError, setCsvError] = useState<string | null>(null);
  const [pitch, setPitch] = useState<string>('');
  const [outputType, setOutputType] = useState<OutputType[]>([OutputType.EMAIL]);
  const [isGroupingEnabled, setIsGroupingEnabled] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [outputs, setOutputs] = useState<PitchOutput[]>([]);
  const [isAdvancedSettingsOpen, setIsAdvancedSettingsOpen] = useState<boolean>(false);
  const [maxPitchLength, setMaxPitchLength] = useState<number>(300);
  const [includeSocialLinks, setIncludeSocialLinks] = useState<boolean>(true);

  const handleFileUpload = async (file: File): Promise<void> => {
    setCsvFile(file);
    try {
      const parsedData = await parseCSV(file);
      const { isValid, error, data } = validateCSV(parsedData);
      
      setIsValidCSV(isValid);
      setCsvError(error);
      
      if (isValid && data) {
        setLeads(data);
      } else {
        setLeads([]);
      }
    } catch (error) {
      setIsValidCSV(false);
      setCsvError(error instanceof Error ? error.message : 'Failed to parse CSV file');
      setLeads([]);
    }
  };

  return (
    <AppContext.Provider value={{
      leads,
      setLeads,
      csvFile,
      setCsvFile,
      isValidCSV,
      setIsValidCSV,
      csvError,
      setCsvError,
      pitch,
      setPitch,
      outputType,
      setOutputType,
      isGroupingEnabled,
      setIsGroupingEnabled,
      isGenerating,
      setIsGenerating,
      progress,
      setProgress,
      outputs,
      setOutputs,
      handleFileUpload,
      isAdvancedSettingsOpen,
      setIsAdvancedSettingsOpen,
      maxPitchLength,
      setMaxPitchLength,
      includeSocialLinks,
      setIncludeSocialLinks
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}; 