import React, { ReactNode } from 'react';
import { BookOpen, MessageSquare } from 'lucide-react';
import { Container, Button, GradientText, Card } from '../../app/components/ui';
import { theme, combineClasses } from '../../app/utils/theme';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Container>
      <header className={combineClasses(
        theme.glassCard,
        'shadow-lg sticky top-0 z-10'
      )}>
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-6 w-6 text-orange-500" />
            <GradientText as="h1" className="text-xl">Smart Pitch Generator</GradientText>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" className="flex items-center space-x-1">
              <BookOpen className="h-5 w-5" />
              <span>Documentation</span>
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      
      <footer className={combineClasses(
        theme.glassCard,
        'py-6 mt-auto'
      )}>
        <div className="container mx-auto px-4 text-center text-gray-300">
          <p>© 2025 Smart Pitch Generator. All rights reserved.</p>
          <div className="flex justify-center mt-2 space-x-4">
            <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </Container>
  );
};