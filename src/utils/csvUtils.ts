import { CSVRow, Lead, ValidationResult } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const parseCSV = async (file: File): Promise<CSVRow[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n');
        
        // Get headers from the first line
        const headers = lines[0].split(',').map(header => header.trim());
        
        const rows: CSVRow[] = [];
        
        // Parse each line from 1 (skip headers)
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue; // Skip empty lines
          
          const values = lines[i].split(',').map(value => value.trim());
          
          // Create row object mapping headers to values
          const row: CSVRow = {};
          headers.forEach((header, index) => {
            row[header] = values[index] || '';
          });
          
          rows.push(row);
        }
        
        resolve(rows);
      } catch (error) {
        reject(new Error('Failed to parse CSV file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsText(file);
  });
};

export const validateCSV = (rows: CSVRow[]): ValidationResult => {
  // Check if there are any rows
  if (rows.length === 0) {
    return {
      isValid: false,
      error: 'CSV file is empty'
    };
  }
  
  // Check for required columns
  const requiredColumns = ['Company Name', 'Company Website', 'Job Title'];
  const hasNameColumns = 
    (Object.keys(rows[0]).includes('Full Name')) || 
    (Object.keys(rows[0]).includes('First Name') && Object.keys(rows[0]).includes('Last Name'));
  
  if (!hasNameColumns) {
    requiredColumns.push('Full Name or First Name + Last Name');
  }
  
  const missingColumns = requiredColumns.filter(col => {
    if (col === 'Full Name or First Name + Last Name') {
      return !hasNameColumns;
    }
    return !Object.keys(rows[0]).some(header => 
      header.toLowerCase() === col.toLowerCase()
    );
  });
  
  if (missingColumns.length > 0) {
    return {
      isValid: false,
      error: `Missing required columns: ${missingColumns.join(', ')}`
    };
  }
  
  // Map CSV rows to Lead objects
  const leads: Lead[] = rows.map(row => {
    const lead: Lead = {
      id: uuidv4(),
      fullName: row['Full Name'] || `${row['First Name'] || ''} ${row['Last Name'] || ''}`.trim(),
      firstName: row['First Name'] || row['Full Name']?.split(' ')[0] || '',
      lastName: row['Last Name'] || (row['Full Name']?.split(' ').length > 1 ? row['Full Name']?.split(' ').slice(1).join(' ') : ''),
      jobTitle: row['Job Title'] || '',
      companyName: row['Company Name'] || '',
      website: row['Company Website'] || '',
      industry: row['Industry'] || '',
      keywords: row['Keywords']?.split(',').map(k => k.trim()) || [],
      location: row['Location'] || ''
    };
    
    return lead;
  });
  
  return {
    isValid: true,
    error: null,
    data: leads
  };
};

// Sample/template CSV data for download
export const getTemplateCSV = (): string => {
  return `Full Name,First Name,Last Name,Job Title,Company Name,Company Website,Industry,Keywords,Location
John Doe,John,Doe,CTO,Acme Inc,https://acme.com,Technology,AI,software,San Francisco
Jane Smith,Jane,Smith,CEO,TechCorp,https://techcorp.com,Software,cloud,enterprise,New York`;
};