import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'small' | 'medium' | 'large';
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  padding = 'medium',
}) => {
  const paddingClass = {
    none: 'p-0',
    small: 'p-2',
    medium: 'p-4',
    large: 'p-6',
  }[padding];

  const hoverClass = hover 
    ? 'transition-transform duration-300 hover:shadow-lg hover:-translate-y-1' 
    : '';

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${paddingClass} ${hoverClass} ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return <div className={`pb-2 mb-4 border-b border-gray-100 ${className}`}>{children}</div>;
};

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return <h3 className={`text-lg font-semibold text-gray-800 ${className}`}>{children}</h3>;
};

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return <div className={className}>{children}</div>;
};

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return <div className={`pt-4 mt-4 border-t border-gray-100 ${className}`}>{children}</div>;
};

export default Card;