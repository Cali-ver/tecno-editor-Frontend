import React from 'react';
import { Icon } from '../common';

const RecentFileItem = ({ file }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors group cursor-pointer">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-lg ${file.iconBg} flex items-center justify-center text-white shadow-sm`}>
          <Icon name={file.icon} className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-text-main text-sm mb-0.5 group-hover:text-primary transition-colors">{file.title}</h4>
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <span className="font-medium">{file.category}</span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span>Edited {file.edited}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex -space-x-2">
          {file.collaborators?.map((avatar, idx) => (
            <img 
              key={idx} 
              src={avatar} 
              alt="User" 
              className="w-8 h-8 rounded-full border-2 border-white shadow-sm" 
            />
          ))}
        </div>
        <Icon name="chevronRight" className="w-5 h-5 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
      </div>
    </div>
  );
};

export default RecentFileItem;
