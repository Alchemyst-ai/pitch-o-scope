import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../app/contexts/AppContext';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { theme, combineClasses } from '../../app/utils/theme';

export const CSVRenderer: React.FC = () => {
  const { csvFile } = useAppContext();
  const [csvData, setCsvData] = useState<Array<Record<string, string>>>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const rowsPerPage = 10;
  
  useEffect(() => {
    if (csvFile) {
      parseCSV(csvFile);
    }
  }, [csvFile]);
  
  const parseCSV = async (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const result = event.target?.result as string;
        const rows = result.split('\n');
        const headers = rows[0].split(',').map(header => 
          header.trim().replace(/^"(.*)"$/, '$1') // Remove quotes if present
        );
        
        const data = rows.slice(1).filter(row => row.trim() !== '').map(row => {
          const values = parseCSVRow(row);
          const rowData: Record<string, string> = {};
          
          // Handle case where values might be fewer than headers
          headers.forEach((header, index) => {
            rowData[header] = values[index] || '';
          });
          
          return rowData;
        });
        
        setHeaders(headers);
        setCsvData(data);
      } catch (error) {
        console.error('Error parsing CSV:', error);
      }
    };
    
    reader.readAsText(file);
  };
  
  // Helper function to correctly parse CSV rows handling quoted values
  const parseCSVRow = (row: string): string[] => {
    const result: string[] = [];
    let inQuotes = false;
    let currentValue = '';
    
    for (let i = 0; i < row.length; i++) {
      const char = row[i];
      const nextChar = row[i + 1];
      
      if (char === '"' && !inQuotes) {
        inQuotes = true;
        continue;
      }
      
      if (char === '"' && inQuotes) {
        if (nextChar === '"') {
          // Handle escaped quotes
          currentValue += '"';
          i++; // Skip the next quote
        } else {
          inQuotes = false;
          continue;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(currentValue);
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    
    result.push(currentValue); // Add the last value
    return result;
  };
  
  // Filter data based on search term
  const filteredData = csvData.filter(row => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return Object.values(row).some(
      value => 
        typeof value === 'string' && 
        value.toLowerCase().includes(searchLower)
    );
  });
  
  // Calculate pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (!csvFile || headers.length === 0) {
    return <div className="text-center py-4 text-gray-300">No CSV file uploaded</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-gray-300" />
          </div>
          <input
            type="text"
            className={combineClasses(
              theme.glassInput,
              theme.glassBorder,
              "block w-full pl-10 pr-3 py-2 rounded-md leading-5 text-white placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            )}
            placeholder="Search CSV data..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page when searching
            }}
          />
        </div>
      </div>
      
      <div className="overflow-x-auto border border-zinc-700 rounded-md">
        <table className="min-w-full divide-y divide-zinc-700">
          <thead className="bg-zinc-900">
            <tr>
              {headers.map((header, index) => (
                <th 
                  key={index}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-zinc-800/50 divide-y divide-zinc-700">
            {currentRows.length > 0 ? (
              currentRows.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-zinc-700/50">
                  {headers.map((header, colIndex) => (
                    <td 
                      key={`${rowIndex}-${colIndex}`} 
                      className="px-4 py-3 text-sm text-gray-200 truncate max-w-[200px]"
                    >
                      {row[header] || ''}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={headers.length} className="px-4 py-6 text-center text-gray-300">
                  {searchTerm ? 'No data matches your search criteria.' : 'No data available.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-300">
            Showing <span className="font-medium">{indexOfFirstRow + 1}</span> to{' '}
            <span className="font-medium">
              {indexOfLastRow > filteredData.length ? filteredData.length : indexOfLastRow}
            </span>{' '}
            of <span className="font-medium">{filteredData.length}</span> rows
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`p-2 rounded-md ${
                currentPage === 1
                  ? 'text-gray-500 cursor-not-allowed'
                  : 'text-gray-300 hover:bg-zinc-700'
              }`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            <span className="text-sm text-gray-300">
              Page {currentPage} of {totalPages}
            </span>
            
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-md ${
                currentPage === totalPages
                  ? 'text-gray-500 cursor-not-allowed'
                  : 'text-gray-300 hover:bg-zinc-700'
              }`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}; 