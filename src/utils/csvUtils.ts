import { CSVRow, Lead, ValidationResult } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { parse } from 'csv-parse/sync';
import Papa from 'papaparse';

export const parseCSV = async (file: File): Promise<CSVRow[]> => {
  // For server-side (API route) context
  if (typeof window === 'undefined') {
    const text = await file.text();
    // Use csv-parse to handle quoted values and commas
    const records = parse(text, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_quotes: true, // Allow quotes to be escaped
      relax_column_count: true, // Handle varying number of columns
      escape: '"', // Use double quotes for escaping
    });
    return records as CSVRow[];
  }
  
  // For client-side context
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        // Use PapaParse to handle quoted values and commas
        Papa.parse<CSVRow>(text, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: false,
          escapeChar: '"', // Use double quotes for escaping
          quoteChar: '"', // Use double quotes as quote character
          complete: (results) => {
            if (results.errors && results.errors.length > 0) {
              reject(new Error('Failed to parse CSV file: ' + results.errors.map((e: Papa.ParseError) => e.message).join('; ')));
            } else {
              resolve(results.data);
            }
          },
          error: (error: Error) => {
            reject(new Error('Failed to parse CSV file: ' + error.message));
          }
        });
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

export const convertJsonToCSV = (jsonData: any[]): string => {
  if (!jsonData.length) return '';
  
  // Get headers from first object
  const headers = Object.keys(jsonData[0]);
  
  // Create CSV header row
  const headerRow = headers.join(',');
  
  // Create data rows
  const dataRows = jsonData.map(obj => {
    return headers.map(header => {
      const value = obj[header];
      // Handle values that contain commas, quotes, or newlines by wrapping in quotes and escaping quotes
      if (typeof value === 'string') {
        // Replace any quotes with double quotes (CSV escaping)
        const escapedValue = value.replace(/"/g, '""');
        // Always wrap in quotes to handle newlines and commas
        return `"${escapedValue}"`;
      }
      // For non-string values, convert to string and wrap in quotes
      return `"${String(value)}"`;
    }).join(',');
  });
  
  // Combine header and data rows
  return [headerRow, ...dataRows].join('\n');
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