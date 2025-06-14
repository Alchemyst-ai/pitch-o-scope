import React from 'react';
import { theme, combineClasses } from '../../utils/theme';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  fullWidth = false,
  size = 'md',
  children,
  className,
  ...props
}) => {
  const baseClasses = combineClasses(
    theme.glassBorder,
    theme.hoverEffect,
    'font-medium rounded-md text-white',
    fullWidth ? 'w-full' : '',
    size === 'sm' ? 'py-1.5 px-3 text-sm' : size === 'lg' ? 'py-3 px-6 text-lg' : 'py-2.5 px-4',
  );

  const variantClasses = {
    primary: theme.buttonGradient,
    secondary: 'bg-gray-800/60 backdrop-blur-xl',
    outline: 'bg-transparent border-2 border-white/20',
  };

  return (
    <button
      className={combineClasses(baseClasses, variantClasses[variant], className || '')}
      {...props}
    >
      {children}
    </button>
  );
}; 