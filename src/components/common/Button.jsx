import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const variants = {
    primary: 'bg-primary hover:bg-primary-hover text-white shadow-sm',
    secondary: 'bg-[#f2f3f5] text-text-muted hover:text-text-main hover:bg-[#e1e2e4]',
    outline: 'border-2 border-dashed border-gray-300 text-text-muted hover:border-primary hover:text-primary bg-transparent',
    ghost: 'text-text-muted hover:text-text-main hover:bg-black/5',
  };

  return (
    <button 
      className={`px-4 py-2 rounded-lg font-bold text-sm transition-all active:scale-95 disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
