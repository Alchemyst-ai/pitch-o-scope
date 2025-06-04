import React from 'react';
import './globals.css';
import { AppProvider } from './contexts/AppContext';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Smart Pitch Generator Application',
  description: 'Generate smart pitches for your leads',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
} 