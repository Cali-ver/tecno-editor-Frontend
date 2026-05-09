import React from 'react';
import { Icon } from '../components/common';

const PlaceholderPage = ({ title }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-10 animate-in zoom-in duration-500">
      <div className="w-24 h-24 bg-[#f2f3f5] rounded-3xl flex items-center justify-center text-text-muted mb-6 shadow-inner">
        <Icon name="layout" className="w-12 h-12" />
      </div>
      <h2 className="text-3xl font-black tracking-tight mb-2 uppercase">{title} Page</h2>
      <p className="text-text-muted font-medium max-w-md">
        We're currently building this section. Check back soon for more production-level features!
      </p>
    </div>
  );
};

export default PlaceholderPage;
