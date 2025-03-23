import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  fullWidth = false,
  className = '',
  disabled = false,
  ariaLabel,
  type = 'button',
  ...rest 
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-400 text-white';
      case 'secondary':
        return 'bg-gray-200 hover:bg-gray-300 focus:ring-gray-300 text-gray-800';
      case 'success':
        return 'bg-green-500 hover:bg-green-600 focus:ring-green-400 text-white';
      case 'danger':
        return 'bg-red-500 hover:bg-red-600 focus:ring-red-400 text-white';
      case 'warning':
        return 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-400 text-white';
      case 'outline':
        return 'bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-50 focus:ring-blue-400';
      case 'link':
        return 'bg-transparent text-blue-600 hover:underline focus:ring-blue-400 p-0';
      default:
        return 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-400 text-white';
    }
  };

  const getSizeClasses = () => {
    if (variant === 'link') return '';
    
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-sm';
      case 'md':
        return 'px-4 py-2';
      case 'lg':
        return 'px-6 py-3 text-lg';
      default:
        return 'px-4 py-2';
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type}
      aria-label={ariaLabel || rest['aria-label']}
      className={`
        ${getVariantClasses()} 
        ${getSizeClasses()} 
        ${fullWidth ? 'w-full' : ''} 
        ${variant !== 'link' ? 'rounded-lg' : ''} 
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} 
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${className}
      `}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;