import React from 'react';
import { Icon } from '../common';

const FolderCard = ({ folder }) => {
  return (
    <div className="bg-white border border-border-color rounded-[2rem] p-8 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500 cursor-pointer group relative overflow-hidden">
      <div className={`w-14 h-14 rounded-2xl ${folder.color} flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-500 shadow-sm`}>
        <Icon name={folder.icon} className="w-7 h-7 fill-current" />
      </div>
      
      <h3 className="font-black text-lg text-text-main mb-2 truncate group-hover:text-primary transition-colors">{folder.title}</h3>
      
      <div className="flex items-center gap-3 text-xs font-bold text-text-muted">
        <span className="bg-gray-100 px-2 py-1 rounded-md">{folder.items} items</span>
      </div>

      <button className="absolute top-8 right-8 p-2 rounded-xl text-text-muted opacity-0 group-hover:opacity-100 hover:bg-gray-100 hover:text-text-main transition-all">
        <Icon name="more" className="w-5 h-5" />
      </button>
    </div>
  );
};

export default FolderCard;
