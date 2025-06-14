import React from 'react';
import { theme, combineClasses } from '../../utils/theme';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const Container: React.FC<ContainerProps> = ({ children, className }) => {
  return (
    <div className={combineClasses(
      theme.backgroundGradient,
      'min-h-screen relative overflow-hidden',
      className || ''
    )}>
      {children}
    </div>
  );
}; 