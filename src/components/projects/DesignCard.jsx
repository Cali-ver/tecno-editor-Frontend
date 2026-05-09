import React from 'react';
import { Icon } from '../common';

const DesignCard = ({ design, onEdit }) => {
  return (
    <div className="group cursor-pointer" onClick={onEdit}>
      <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden mb-4 border border-border-color bg-[#f2f3f5] shadow-sm group-hover:shadow-[0_20px_50px_rgba(139,61,255,0.15)] group-hover:-translate-y-2 transition-all duration-500">
        <img 
          src={design.image} 
          alt={design.title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        
        {/* Modern Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
          <button 
            className="bg-white text-text-main px-6 py-2.5 rounded-xl font-black text-sm shadow-2xl hover:scale-105 active:scale-95 transition-all"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          >
            Edit Design
          </button>
        </div>

        {/* Quick action button */}
        <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center text-text-main opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-white shadow-lg">
          <Icon name="more" className="w-5 h-5" />
        </button>
      </div>

      <div className="px-2">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h3 className="font-black text-text-main text-base truncate group-hover:text-primary transition-colors flex-1">
            {design.title}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
          <p className="text-xs font-bold text-text-muted">Edited {design.edited}</p>
        </div>
      </div>
    </div>
  );
};

export default DesignCard;
