export enum OutputType {
  EMAIL = 'Email',
  LINKEDIN = 'LinkedIn Message'
}

export interface Lead {
  id: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  jobTitle: string;
  companyName: string;
  website: string;
  industry?: string;
  keywords?: string[];
  location?: string;
}

export interface PitchOutput {
  id: string;
  lead: Lead;
  pitchAngle: string;
  personalizedMessage: string;
  outputType: OutputType;
}

export interface CSVRow {
  [key: string]: string;
}

export interface ValidationResult {
  isValid: boolean;
  error: string | null;
  data?: Lead[];
}

export interface RunHistoryItem {
  id: string;
  fileName: string;
  timestamp: Date;
  leadCount: number;
  outputTypes: OutputType[];
}