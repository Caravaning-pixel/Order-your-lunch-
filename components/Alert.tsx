
import React from 'react';

interface AlertProps {
  type: 'success' | 'error';
  children: React.ReactNode;
}

const Alert: React.FC<AlertProps> = ({ type, children }) => {
  const baseClasses = 'p-4 mb-4 text-sm rounded-lg';
  const typeClasses = {
    success: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`} role="alert">
      <span className="font-medium">{type === 'success' ? 'Uspeh!' : 'Napaka!'}</span> {children}
    </div>
  );
};

export default Alert;
