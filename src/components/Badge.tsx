import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'urgency-high' | 'urgency-medium' | 'urgency-low';
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'primary' }) => {
  const baseStyles = "px-2 py-1 rounded-full text-xs font-semibold inline-block";
  const variants = {
    primary: "bg-blue-100 text-blue-800",
    secondary: "bg-gray-100 text-gray-800",
    'urgency-high': "bg-red-500 text-white",
    'urgency-medium': "bg-yellow-400 text-black",
    'urgency-low': "bg-green-500 text-white",
  };

  return (
    <span className={`${baseStyles} ${variants[variant]}`}>
      {children}
    </span>
  );
};

export default Badge;
