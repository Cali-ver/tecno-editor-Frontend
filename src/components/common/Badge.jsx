import React from 'react';

const Badge = ({ children, className = '' }) => (
  <span className={`bg-black/60 backdrop-blur-md text-[10px] font-black text-white px-2 py-1 rounded-md tracking-widest uppercase ${className}`}>
    {children}
  </span>
);

export default Badge;
