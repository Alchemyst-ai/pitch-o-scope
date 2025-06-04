import React, { ReactNode } from 'react';
import { BookOpen, MessageSquare, Send } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-indigo-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-6 w-6" />
            <h1 className="text-xl font-bold">Smart Pitch Generator</h1>
          </div>
          <div className="flex items-center space-x-4">
            <a href="#" className="flex items-center space-x-1 text-indigo-100 hover:text-white transition-colors">
              <BookOpen className="h-5 w-5" />
              <span>Documentation</span>
            </a>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      
      <footer className="bg-gray-100 border-t border-gray-200 py-6">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2025 Smart Pitch Generator. All rights reserved.</p>
          <div className="flex justify-center mt-2 space-x-4">
            <a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};