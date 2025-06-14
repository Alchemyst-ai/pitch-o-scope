import React from 'react';
import { theme, combineClasses } from '../../utils/theme';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={combineClasses(
      theme.glassCard,
      theme.glassBorder,
      'rounded-xl p-6',
      className || ''
    )}>
      {children}
    </div>
  );
}; 