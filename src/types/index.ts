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
  website?: string;
  industry?: string;
  keywords?: string[];
  location?: string;
}

export interface LeadData {
  id: string;
  "Linkedin Url"?: string;
  "Full Name": string;
  "First Name"?: string;
  "Last Name"?: string;
  "Email"?: string;
  "Email Status"?: string;
  "Job Title": string;
  "Company Name": string;
  "Company Website"?: string;
  "City"?: string;
  "State"?: string;
  "Country"?: string;
  "Industry"?: string;
  "Keywords"?: string;
  "Employees"?: string;
  "Company City"?: string;
  "Company State"?: string;
  "Company Country"?: string;
  "Company Linkedin Url"?: string;
  "Company Twitter Url"?: string;
  "Company Facebook Url"?: string;
  "Company Phone Numbers"?: string;
  "Twitter Url"?: string;
  "Facebook Url"?: string;
  groupName?: string;
  pitch?: string;
}

export interface PitchOutput {
  id: string;
  fullName?: string;
  jobTitle?: string;
  companyName?: string;
  groupName?: string;
  pitch?: string;
  // Keep these for backward compatibility
  lead?: Lead;
  pitchAngle?: string;
  personalizedMessage?: string;
  outputType?: OutputType;
  // New format with data field
  type?: string;
  data?: LeadData;
  timestamp?: string;
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