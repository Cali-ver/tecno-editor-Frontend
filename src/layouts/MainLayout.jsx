import React from 'react';
import { Sidebar, Header } from '../components/layout';
import { Icon } from '../components/common';

const MainLayout = ({ children, activeTab, onTabChange }) => {
  return (
    <div className="flex min-h-screen font-sans bg-bg-main text-text-main selection:bg-primary/20 selection:text-primary">
      {/* Sidebar - Fixed Position */}
      <Sidebar activeTab={activeTab} onTabChange={onTabChange} />

      {/* Main Content Area */}
      <div className="flex-1 ml-60 flex flex-col relative">
        {/* Header - Sticky */}
        <Header />

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth">
          {children}
          {/* Footer Spacer */}
          <footer className="h-20" />
        </main>

        {/* Floating Action Button - Fixed */}
        <button 
          className="fixed bottom-10 right-10 w-16 h-16 bg-primary hover:bg-primary-hover text-white rounded-2xl flex items-center justify-center shadow-[0_15px_40px_rgba(139,61,255,0.4)] hover:shadow-[0_20px_50px_rgba(139,61,255,0.6)] hover:scale-110 active:scale-95 transition-all z-50 group"
          title="Create New Design"
        >
          <Icon name="plus" className="w-8 h-8 group-hover:rotate-180 transition-transform duration-500" />
        </button>
      </div>
    </div>
  );
};

export default MainLayout;
