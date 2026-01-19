/**
 * @file components/ui/Card.tsx
 * @description Componente de tarjeta reutilizable
 */

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
}) => {
  return (
    <div className={`card-glass ${paddingStyles[padding]} ${className}`}>
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      {children}
    </div>
  );
};

interface CardTitleProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const CardTitle: React.FC<CardTitleProps> = ({ children, icon }) => {
  return (
    <div className="flex items-center gap-2">
      {icon && <span className="text-emerald-500">{icon}</span>}
      <span className="text-white font-medium">{children}</span>
    </div>
  );
};
