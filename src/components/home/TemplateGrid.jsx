import React from 'react';
import { templateCategories } from '../../data/mockData';

export const TemplateGrid = () => {
  return (
    <section className="px-10 py-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black tracking-tight">Start with a template</h2>
        <a href="#" className="text-primary font-bold text-sm hover:underline flex items-center gap-1">
          See all templates 
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
        </a>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6 pb-6">
        {templateCategories.map((cat) => (
          <div key={cat.id} className="group cursor-pointer">
            <div className="aspect-[4/3] bg-white rounded-2xl overflow-hidden mb-4 ring-1 ring-border-color group-hover:ring-2 group-hover:ring-primary transition-all shadow-sm hover:shadow-xl relative">
              <img src={cat.image} alt={cat.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 transform-gpu will-change-transform" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
            </div>
            <p className="text-sm font-bold text-center group-hover:text-primary transition-colors">{cat.label}</p>
          </div>
        ))}
        {/* Custom Size Card */}
        <div className="group cursor-pointer">
          <div className="aspect-[4/3] bg-white rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-gray-300 group-hover:border-primary group-hover:bg-primary/5 transition-all">
            <div className="w-10 h-10 rounded-full bg-[#f2f3f5] flex items-center justify-center text-text-muted group-hover:text-primary group-hover:scale-110 transition-all mb-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
            </div>
            <p className="text-xs font-bold text-text-muted group-hover:text-primary">Custom Size</p>
          </div>
        </div>
      </div>
    </section>
  );
};
