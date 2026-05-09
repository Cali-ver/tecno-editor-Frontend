import React, { useState } from 'react';
import { Icon } from '../components/common';
import { trendingTemplates, socialMediaTemplates } from '../data/mockData';
import { useNavigate } from 'react-router-dom';

const TemplateCard = ({ template, onSelect }) => {
  return (
    <div 
      onClick={() => onSelect(template)}
      className="group cursor-pointer flex flex-col bg-white rounded-2xl overflow-hidden border border-border-color hover:shadow-xl hover:border-primary transition-all duration-300"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={template.image} 
          alt={template.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 transform-gpu will-change-transform"
        />
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded text-[10px] font-bold ${
            template.label === 'PRO' 
              ? 'bg-gradient-to-r from-[#8b3dff] to-[#00c4cc] text-white'
              : 'bg-white/90 text-text-main backdrop-blur-sm shadow-sm transform-gpu will-change-transform'
          }`}>
            {template.label}
          </span>
        </div>
        {/* Overlay hover effect */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-white/90 backdrop-blur-sm text-text-main font-bold py-2 px-6 rounded-full shadow-lg transform-gpu will-change-transform">
            Use Template
          </div>
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-bold text-text-main text-sm mb-1 truncate">{template.title}</h3>
        <p className="text-xs text-text-muted mt-auto">{template.type}</p>
      </div>
    </div>
  );
};

const Templates = ({ onEditDesign }) => {
  const navigate = useNavigate();

  const handleTemplateSelect = (template) => {
    // Navigate to editor or call the onEditDesign prop
    if (onEditDesign) {
      onEditDesign(template);
    } else {
      navigate('/editor');
    }
  };

  return (
    <div className="flex min-h-full bg-white animate-in fade-in duration-500">
      {/* Main Content Area */}
      <div className="flex-1 bg-[#f9fafb] relative min-w-0">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-[#4f46e5] via-[#7c3aed] to-[#8b3dff] py-16 px-10 flex flex-col items-center justify-center text-white relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none transform-gpu">
            <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white blur-3xl transform-gpu will-change-transform"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#00c4cc] blur-3xl transform-gpu will-change-transform"></div>
          </div>

          <h1 className="text-4xl md:text-5xl font-black mb-8 text-center tracking-tight relative z-10">What will you design today?</h1>
          
          <div className="w-full max-w-3xl relative z-10 group">
            <Icon name="search" className="w-6 h-6 absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search 100,000+ templates" 
              className="w-full py-4 pl-14 pr-6 rounded-2xl text-lg text-text-main shadow-2xl focus:outline-none focus:ring-4 focus:ring-primary/30 transition-all border-none bg-white/95 backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Pills Navigation */}
        <div className="px-10 py-4 border-b border-border-color bg-white/95 backdrop-blur-md sticky top-0 z-20 shadow-sm transform-gpu will-change-transform">
           <div className="flex gap-3 flex-wrap">
             <button className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] text-white font-bold whitespace-nowrap shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
               <Icon name="more" className="w-4 h-4" />
               For You
             </button>
             {["Presentations", "Social Media", "Posters", "Resumes", "Logos", "Videos", "Flyers", "Cards", "Infographics"].map(tab => (
               <button 
                 key={tab} 
                 className="px-6 py-2.5 rounded-full border border-border-color hover:border-primary hover:text-primary text-text-main font-semibold whitespace-nowrap transition-all hover:-translate-y-0.5 bg-white"
               >
                 {tab}
               </button>
             ))}
           </div>
        </div>

        {/* Trending Now */}
        <div className="px-10 py-12">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-black mb-2 tracking-tight">Trending now</h2>
              <p className="text-text-muted font-medium">The most popular formats this week</p>
            </div>
            <button className="text-primary font-bold flex items-center gap-1 hover:underline group">
              See all 
              <Icon name="more" className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
             {trendingTemplates.map(template => (
               <TemplateCard key={template.id} template={template} onSelect={handleTemplateSelect} />
             ))}
          </div>
        </div>
        
        {/* Social Media */}
        <div className="px-10 py-12 pt-0">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-black mb-2 tracking-tight">Social Media</h2>
              <p className="text-text-muted font-medium">Grow your audience with high-impact visuals</p>
            </div>
            <button className="text-primary font-bold flex items-center gap-1 hover:underline group">
              See all 
              <Icon name="more" className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
            {socialMediaTemplates.map(template => (
               <TemplateCard key={template.id} template={template} onSelect={handleTemplateSelect} />
             ))}
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Templates;
