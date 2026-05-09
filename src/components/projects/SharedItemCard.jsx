import React from 'react';
import { Icon } from '../common';

const SharedItemCard = ({ item }) => {
  return (
    <div className="bg-white border border-border-color rounded-2xl overflow-hidden hover:shadow-xl transition-all group cursor-pointer">
      <div className="relative aspect-[4/3] bg-gray-50 flex items-center justify-center">
        {item.type === 'folder' ? (
          <div className="w-16 h-16 text-indigo-200">
            <Icon name="folder" className="w-full h-full fill-current" />
          </div>
        ) : (
          <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
        )}
        {item.isTemplate && (
           <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-md text-[10px] font-black uppercase text-primary">Template</span>
        )}
        <div className="absolute bottom-3 left-3 flex -space-x-2">
            {item.avatars?.map((avatar, i) => (
                <img key={i} src={avatar} className="w-6 h-6 rounded-full border-2 border-white shadow-sm" alt="Collaborator" />
            ))}
        </div>
      </div>
      <div className="p-4 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h4 className="font-bold text-text-main text-sm truncate group-hover:text-primary transition-colors">{item.title}</h4>
          <p className="text-[10px] text-text-muted mt-0.5 font-medium">Shared by {item.sharedBy}</p>
        </div>
        <button className="text-text-muted hover:text-text-main p-1 rounded-md hover:bg-gray-100 transition-all">
          <Icon name="more" className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default SharedItemCard;
