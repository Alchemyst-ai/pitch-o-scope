import React from 'react';
import './globals.css';
import { AppProvider } from './contexts/AppContext';
import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
});

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
    <html lang="en" className={spaceGrotesk.className}>
      <body>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
} 