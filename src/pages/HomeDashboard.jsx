import React from 'react';
import { Icon } from '../components/common';
import DesignCard from '../components/projects/DesignCard';

const HomeDashboard = () => {
  const templates = [
    { name: 'Presentation', icon: 'grid', image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=400&auto=format&fit=crop' },
    { name: 'Social Media', icon: 'share', image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=400&auto=format&fit=crop' },
    { name: 'Poster', icon: 'layout', image: 'https://images.unsplash.com/photo-1540575861501-7ce05b402f19?q=80&w=400&auto=format&fit=crop' },
    { name: 'Video', icon: 'monitor', image: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=400&auto=format&fit=crop' },
    { name: 'Docs', icon: 'award', image: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?q=80&w=400&auto=format&fit=crop' },
  ];

  const recentDesigns = [
    { id: 1, title: 'Annual Brand Guidelines 2024', edited: '2 hours ago', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop', isDraft: true },
    { id: 2, title: 'Instagram Campaign', edited: 'Yesterday', category: 'Social Media', image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&auto=format&fit=crop' },
    { id: 3, title: 'UI Design System', edited: '3 days ago', category: 'Product', image: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?q=80&w=800&auto=format&fit=crop' },
    { id: 4, title: 'Q3 Roadmap Presentation', edited: '1 week ago', category: 'Presentation', image: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=800&auto=format&fit=crop' },
  ];

  return (
    <div className="px-10 py-8 animate-in fade-in duration-700">
      {/* Search Hero */}
      <div className="bg-gradient-to-r from-[#4d57ef] to-[#7c3aed] rounded-[2rem] p-12 text-center mb-12 shadow-2xl shadow-primary/20">
        <h1 className="text-4xl font-black text-white mb-8">What will you design today?</h1>
        <div className="relative max-w-3xl mx-auto">
          <Icon name="search" className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
          <input 
            type="text" 
            placeholder="Search templates, fonts, or elements..." 
            className="w-full pl-16 pr-6 py-5 rounded-2xl bg-white border-none shadow-xl text-lg focus:ring-4 focus:ring-white/20 transition-all outline-none"
          />
        </div>
      </div>

      {/* Templates Section */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-text-main">Start with a template</h2>
          <button className="text-sm font-bold text-text-muted hover:text-primary flex items-center gap-1 transition-colors">
            See all templates <Icon name="chevronRight" className="w-4 h-4" />
          </button>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {templates.map((temp) => (
            <div key={temp.name} className="shrink-0 group cursor-pointer">
              <div className="w-44 h-28 rounded-2xl overflow-hidden mb-3 shadow-md group-hover:shadow-xl transition-all">
                <img src={temp.image} alt={temp.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <p className="text-sm font-bold text-gray-700 text-center">{temp.name}</p>
            </div>
          ))}
          <div className="shrink-0">
            <div className="w-44 h-28 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer text-gray-400 hover:text-primary">
              <div className="bg-primary/10 p-2 rounded-full">
                <Icon name="plus" className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold">Custom Size</span>
            </div>
            <p className="text-sm font-bold text-gray-700 text-center mt-3">Custom</p>
          </div>
        </div>
      </div>

      {/* Recent Designs */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-text-main">Recent designs</h2>
          <div className="flex bg-[#f2f3f5] p-1 rounded-xl border border-border-color">
            <button className="p-2 bg-white rounded-lg shadow-sm text-primary">
              <Icon name="grid" className="w-5 h-5" />
            </button>
            <button className="p-2 text-text-muted hover:text-text-main transition-colors">
              <Icon name="layout" className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {recentDesigns.map((design) => (
            <div key={design.id} className="group cursor-pointer">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden mb-4 shadow-sm group-hover:shadow-2xl transition-all border border-gray-100">
                <img src={design.image} alt={design.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                {design.isDraft && (
                  <span className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white text-[10px] font-black px-2 py-1 rounded-md tracking-widest uppercase">Draft</span>
                )}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <button className="bg-white/20 backdrop-blur-md text-white px-6 py-2 rounded-full font-bold border border-white/30">Edit</button>
                </div>
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-text-main group-hover:text-primary transition-colors leading-tight">{design.title}</h3>
                  <p className="text-[11px] text-text-muted font-bold mt-1 uppercase tracking-wider">
                    {design.category ? `${design.category} • ` : ''}{design.edited}
                  </p>
                </div>
                <button className="p-1 hover:bg-gray-100 rounded-full text-text-muted">
                  <Icon name="more" className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
          {/* Create new document card */}
          <div className="group cursor-pointer">
            <div className="aspect-[4/3] rounded-3xl bg-[#f2f3f5] border-2 border-dashed border-gray-200 flex items-center justify-center group-hover:border-primary group-hover:bg-primary/5 transition-all mb-4">
              <div className="relative w-16 h-20 bg-white rounded-lg shadow-md flex items-center justify-center overflow-hidden">
                <div className="absolute top-0 right-0 w-8 h-8 bg-gray-50 -rotate-45 translate-x-4 -translate-y-4"></div>
                <Icon name="plus" className="w-8 h-8 text-gray-300 group-hover:text-primary transition-colors" />
              </div>
            </div>
            <h3 className="font-bold text-text-main group-hover:text-primary transition-colors leading-tight">Untitled Document</h3>
            <p className="text-[11px] text-text-muted font-bold mt-1 uppercase tracking-wider">Draft</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeDashboard;
