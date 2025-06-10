import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../app/contexts/AppContext';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Lead } from '../types';

export const LeadTable: React.FC = () => {
  const { leads } = useAppContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const leadsPerPage = 10;
  
  // Get the raw column headers directly from the lead objects
  const columns = useMemo(() => {
    if (leads.length === 0) return [];
    
    // Extract all keys from the leads and use them directly as columns
    const allKeys = new Set<string>();
    leads.forEach(lead => {
      Object.keys(lead).forEach(key => {
        if (key !== 'id' && key !== 'keywords') { // Skip internal fields
          allKeys.add(key);
        }
      });
    });
    
    return Array.from(allKeys);
  }, [leads]);
  
  // Filter leads based on search term
  const filteredLeads = leads.filter(lead => {
    const searchLower = searchTerm.toLowerCase();
    return Object.values(lead).some(
      value => 
        typeof value === 'string' && 
        value.toLowerCase().includes(searchLower)
    );
  });
  
  // Calculate pagination
  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);
  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);
  
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

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-gray-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page when searching
            }}
          />
        </div>
      </div>
      
      <div className="overflow-x-auto border rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map(column => (
                <th 
                  key={column}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentLeads.length > 0 ? (
              currentLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  {columns.map(column => (
                    <td 
                      key={`${lead.id}-${column}`} 
                      className="px-4 py-3 text-sm text-gray-500 truncate max-w-[200px]"
                    >
                      {renderCellContent(column, (lead as any)[column])}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-6 text-center text-gray-500">
                  {searchTerm ? 'No leads match your search criteria.' : 'No leads available.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{indexOfFirstLead + 1}</span> to{' '}
            <span className="font-medium">
              {indexOfLastLead > filteredLeads.length ? filteredLeads.length : indexOfLastLead}
            </span>{' '}
            of <span className="font-medium">{filteredLeads.length}</span> leads
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`p-2 rounded-md ${
                currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-md ${
                currentPage === totalPages
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
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

// Helper function to render cell content based on value type
function renderCellContent(key: string, value: any): React.ReactNode {
  if (value === undefined || value === null) {
    return '';
  }
  
  if (key === 'website' && value) {
    return (
      <a 
        href={value.startsWith('http') ? value : `https://${value}`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-indigo-600 hover:text-indigo-800 hover:underline"
      >
        {value}
      </a>
    );
  }
  
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  
  return value;
}