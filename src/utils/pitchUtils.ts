import { Lead, OutputType, PitchOutput } from '../types';
import { v4 as uuidv4 } from 'uuid';

// In a real application, this would be an API call to a language model service
export const generatePitch = async (
  lead: Lead, 
  startupPitch: string, 
  outputType: OutputType,
  maxLength: number = 300,
  includeSocialLinks: boolean = true
): Promise<PitchOutput> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
  
  // This is a placeholder implementation
  // In a real app, this would call an AI service like OpenAI
  const pitchAngle = generatePitchAngle(lead, startupPitch);
  const message = generatePersonalizedMessage(lead, pitchAngle, outputType, maxLength, includeSocialLinks);
  
  return {
    id: uuidv4(),
    lead,
    pitchAngle,
    personalizedMessage: message,
    outputType
  };
};

// Generate pitch angles based on lead data (simple placeholder implementation)
const generatePitchAngle = (lead: Lead, startupPitch: string): string => {
  const industries = [
    'technology', 'software', 'fintech', 'healthcare', 'retail', 
    'manufacturing', 'education', 'real estate', 'transportation'
  ];
  
  // Check if the lead's industry matches any of the known industries
  const matchedIndustry = industries.find(ind => 
    lead.industry?.toLowerCase().includes(ind) || ind.includes(lead.industry?.toLowerCase() || '')
  );
  
  if (matchedIndustry) {
    return `${startupPitch.substring(0, 50)}... with specific benefits for ${matchedIndustry} companies like ${lead.companyName}`;
  }
  
  // If no industry match, try to find relevant keywords
  if (lead.keywords && lead.keywords.length > 0) {
    return `${startupPitch.substring(0, 50)}... with features relevant to your interests in ${lead.keywords.slice(0, 2).join(' and ')}`;
  }
  
  // Default fallback
  return `${startupPitch.substring(0, 50)}... which can help companies like ${lead.companyName} improve efficiency`;
};

// Generate personalized message based on pitch angle (simple placeholder implementation)
const generatePersonalizedMessage = (
  lead: Lead, 
  pitchAngle: string, 
  outputType: OutputType,
  maxLength: number,
  includeSocialLinks: boolean
): string => {
  const firstName = lead.firstName || lead.fullName.split(' ')[0];
  const companyName = lead.companyName;
  
  let message = '';
  
  if (outputType === OutputType.EMAIL) {
    message = `
Hi ${firstName},

I noticed your role as ${lead.jobTitle} at ${companyName} and thought you might be interested in our solution.

${pitchAngle}

Would you be open to a 15-minute call next week to discuss how we could specifically help ${companyName}?

Best regards,
[Your Name]
[Your Company]
${includeSocialLinks ? '[Your LinkedIn/Twitter]' : ''}
    `.trim();
  } else {
    message = `
Hi ${firstName}, I noticed your role as ${lead.jobTitle} at ${companyName}. ${pitchAngle} Would you be open to a quick chat about how we could help? Thanks!
    `.trim();
  }
  
  // Ensure message doesn't exceed max length
  if (message.length > maxLength) {
    message = message.substring(0, maxLength - 3) + '...';
  }
  
  return message;
};

// Function to generate pitches for all leads
export const generatePitches = async (
  leads: Lead[],
  startupPitch: string,
  outputTypes: OutputType[],
  onProgress: (progress: number) => void,
  maxLength: number = 300,
  includeSocialLinks: boolean = true
): Promise<PitchOutput[]> => {
  const outputs: PitchOutput[] = [];
  let completed = 0;
  
  for (const lead of leads) {
    for (const outputType of outputTypes) {
      const output = await generatePitch(lead, startupPitch, outputType, maxLength, includeSocialLinks);
      outputs.push(output);
      
      completed++;
      onProgress(Math.round((completed / (leads.length * outputTypes.length)) * 100));
    }
  }
  
  return outputs;
};

// Convert pitch outputs to CSV
export const outputsToCSV = (outputs: PitchOutput[]): string => {
  const headers = [
    'Full Name', 
    'Job Title', 
    'Company Name', 
    'Output Type',
    'Pitch Angle', 
    'Personalized Message'
  ].join(',');
  
  const rows = outputs.map(output => {
    return [
      `"${output.lead?.fullName}"`,
      `"${output.lead?.jobTitle}"`,
      `"${output.lead?.companyName}"`,
      `"${output.outputType}"`,
      `"${output.pitchAngle?.replace(/"/g, '""')}"`,
      `"${output.personalizedMessage?.replace(/"/g, '""')}"`
    ].join(',');
  });
  
  return [headers, ...rows].join('\n');
};