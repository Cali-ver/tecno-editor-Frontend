import React from 'react';

const LoadingSpinner = ({ size = "w-5 h-5", color = "text-white" }) => {
  return (
    <div className={`animate-spin rounded-full border-2 border-current border-t-transparent ${size} ${color}`} role="status">
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;
