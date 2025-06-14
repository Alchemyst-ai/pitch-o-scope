import React from 'react';
import { theme, combineClasses } from '../../utils/theme';

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
}

export const GradientText: React.FC<GradientTextProps> = ({ 
  children, 
  className,
  as = 'h1'
}) => {
  const Component = as;
  
  return (
    <Component className={combineClasses(
      theme.titleGradient,
      'font-bold inline-block',
      className || ''
    )}>
      {children}
    </Component>
  );
}; 