import React, { useState } from 'react';
import { useAppContext } from '../../app/contexts/AppContext';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

export const LeadTable: React.FC = () => {
  const { leads } = useAppContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const leadsPerPage = 10;
  
  // Filter leads based on search term
  const filteredLeads = leads.filter(lead => 
    lead.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
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
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Website</th>
              {leads.some(lead => lead.industry) && (
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Industry</th>
              )}
              {leads.some(lead => lead.location) && (
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentLeads.length > 0 ? (
              currentLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{lead.fullName}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{lead.jobTitle}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{lead.companyName}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-[200px]">
                    <a 
                      href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800 hover:underline"
                    >
                      {lead.website}
                    </a>
                  </td>
                  {leads.some(lead => lead.industry) && (
                    <td className="px-4 py-3 text-sm text-gray-500">{lead.industry}</td>
                  )}
                  {leads.some(lead => lead.location) && (
                    <td className="px-4 py-3 text-sm text-gray-500">{lead.location}</td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
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