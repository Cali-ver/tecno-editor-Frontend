import React from 'react';
import { Icon } from '../common';

const Hero = () => {
  return (
    <section className="px-10 py-8">
      <div className="bg-gradient-to-r from-[#575ce5] via-[#7d2ae8] to-[#8b3dff] rounded-[2rem] p-20 text-center text-white relative overflow-hidden shadow-2xl group">
        {/* Animated Background Blobs */}
        <div className="absolute top-0 -left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse delay-700"></div>

        <h1 className="text-6xl font-black mb-12 tracking-tighter leading-tight">
          What will you <span className="text-[#00c4cc]">design</span> today?
        </h1>
        
        <div className="max-w-2xl mx-auto relative group">
          <div className="absolute inset-0 bg-white/20 blur-xl rounded-full scale-95 opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
          <Icon name="search" className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors z-20 w-6 h-6" />
          <input 
            type="text" 
            placeholder="Search templates, fonts, or elements..." 
            className="w-full pl-16 pr-8 py-5 rounded-full bg-white text-text-main text-xl shadow-2xl focus:outline-none focus:ring-4 focus:ring-primary/30 transition-all placeholder:text-gray-400 relative z-10"
          />
        </div>

        <div className="mt-8 flex justify-center gap-4 text-sm font-bold">
            <span className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full cursor-pointer hover:bg-white/20 transition-all border border-white/10">#SocialMedia</span>
            <span className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full cursor-pointer hover:bg-white/20 transition-all border border-white/10">#Presentation</span>
            <span className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full cursor-pointer hover:bg-white/20 transition-all border border-white/10">#LogoDesign</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
