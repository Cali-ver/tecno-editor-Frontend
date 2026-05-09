import React from 'react';
import { sidebarItems } from '../../data/mockData';
import { Icon, Button } from '../common';

const Sidebar = ({ activeTab, onTabChange }) => {
  return (
    <aside className="w-60 bg-white border-r border-border-color fixed h-full flex flex-col px-4 py-6 z-50">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8 px-2 cursor-pointer group">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00c4cc] to-[#7d2ae8] group-hover:scale-110 transition-transform"></div>
        <span className="text-xl font-bold tracking-tight text-[#00c4cc]">DesignStudio</span>
      </div>

      {/* Team Profile */}
      <div className="flex items-center gap-3 p-2 rounded-lg bg-[#f2f3f5]/50 border border-border-color mb-8 group cursor-pointer hover:bg-[#f2f3f5] transition-colors">
        <div className="w-10 h-10 rounded-md bg-[#8b3dff] flex items-center justify-center text-white shadow-lg">
          <Icon name="award" className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-bold">Creative Team</p>
          <p className="text-[10px] text-text-muted font-medium">Pro Plan</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-semibold transition-all ${
              activeTab === item.id 
                ? 'bg-[#f2f3f5] text-primary shadow-sm' 
                : 'text-text-muted hover:bg-black/5 hover:text-text-main'
            }`}
          >
            <Icon name={item.icon} className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer Actions */}
      <div className="mt-auto flex flex-col gap-4">
        <div className="border-t border-border-color pt-6">
          <button className="flex items-center gap-3 px-3 py-2 text-text-muted hover:text-text-main hover:bg-black/5 rounded-lg w-full transition-all font-semibold">
            <Icon name="folder" className="w-5 h-5" />
            <span>Trash</span>
          </button>
        </div>

        <div className="p-4 bg-[#f2f3f5] rounded-xl border border-border-color">
            <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-3">Team Workspace</p>
            <Button variant="outline" className="w-full flex items-center justify-center gap-2 py-2">
                <Icon name="plus" className="w-4 h-4" />
                Invite members
            </Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
