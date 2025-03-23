import React from 'react';

const Card = ({ children, darkMode, className = '' }) => {
  return (
    <div className={`p-4 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'} ${className}`}>
      {children}
    </div>
  );
};

export default Card;