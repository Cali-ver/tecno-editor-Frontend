import React, { useState, useEffect } from 'react';
import { Icon } from '../components/common';
import FolderCard from '../components/projects/FolderCard';
import DesignCard from '../components/projects/DesignCard';
import SharedItemCard from '../components/projects/SharedItemCard';
import api from '../api/client';

const Projects = ({ onEditDesign }) => {
  const [activeSubTab, setActiveSubTab] = useState('Folders');
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        const response = await api.get('/designs');
        setDesigns(response.data);
      } catch (error) {
        console.error('Error fetching designs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDesigns();
  }, []);

  const tabs = ['All Projects', 'Folders', 'Designs', 'Shared with you'];

  const folders = [
    { id: 1, title: 'Client Assets', items: 248, icon: 'folder', color: 'bg-blue-50' },
    { id: 2, title: 'Social Media', items: '1.2k', icon: 'share', color: 'bg-pink-50' },
    { id: 3, title: 'Marketing', items: 45, icon: 'megaphone', color: 'bg-slate-100' },
    { id: 4, title: 'Event Graphics', items: 82, icon: 'party', color: 'bg-amber-50' },
    { id: 5, title: 'Brand Identity', items: 12, icon: 'sparkles', color: 'bg-emerald-50' },
    { id: 6, title: 'Templates', items: 56, icon: 'grid', color: 'bg-indigo-50' },
  ];

  const sharedItems = [
    { id: 1, type: 'folder', title: 'Q4 Marketing Assets', sharedBy: 'Sarah Miller • 2h ago', avatars: ['https://ui-avatars.com/api/?name=SM&background=random', 'https://ui-avatars.com/api/?name=JD&background=random'] },
    { id: 2, type: 'design', title: 'Brand Style Guide v2', sharedBy: 'David Chen', image: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?q=80&w=800&auto=format&fit=crop', isTemplate: true, avatars: ['https://ui-avatars.com/api/?name=DC&background=random'] },
    { id: 3, type: 'design', title: 'Annual Report 2024', sharedBy: 'Elena Rossi', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop', avatars: ['https://ui-avatars.com/api/?name=ER&background=random'] },
    { id: 4, type: 'design', title: 'Project Roadmap', sharedBy: 'Marcus T.', image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=800&auto=format&fit=crop', avatars: ['https://ui-avatars.com/api/?name=MT&background=random'] },
    { id: 5, type: 'folder', title: 'Social Media Kit', sharedBy: 'Alex Wong • Yesterday', avatars: ['https://ui-avatars.com/api/?name=AW&background=random'] },
    { id: 6, type: 'design', title: 'Identity Concept v4', sharedBy: 'Sarah Miller', image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=800&auto=format&fit=crop', avatars: ['https://ui-avatars.com/api/?name=SM&background=random'] },
    { id: 7, type: 'design', title: 'Event Poster Final', sharedBy: 'James Wilson', image: 'https://images.unsplash.com/photo-1540575861501-7ce05b402f19?q=80&w=800&auto=format&fit=crop', avatars: ['https://ui-avatars.com/api/?name=JW&background=random'] },
    { id: 8, type: 'design', title: 'Business Cards', sharedBy: 'Elena Rossi', image: 'https://images.unsplash.com/photo-1589330273594-fade1ee91647?q=80&w=800&auto=format&fit=crop', avatars: ['https://ui-avatars.com/api/?name=ER&background=random'] },
  ];

  return (
    <div className="px-8 py-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out relative min-h-screen">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black tracking-tight text-text-main">
          {activeSubTab === 'Shared with you' ? 'Shared with me' : 'Projects'}
        </h1>
        <div className="flex items-center gap-4">
          {activeSubTab === 'Shared with you' ? (
             <>
               <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-text-main hover:bg-gray-50 transition-all">
                  <Icon name="grid" className="w-4 h-4" />
                  Latest
               </button>
               <div className="flex bg-[#f2f3f5] p-1 rounded-lg border border-border-color">
                <button className="p-1.5 bg-white rounded-md shadow-sm text-primary">
                  <Icon name="grid" className="w-4 h-4" />
                </button>
                <button className="p-1.5 text-text-muted hover:text-text-main transition-colors">
                  <Icon name="layout" className="w-4 h-4" />
                </button>
              </div>
             </>
          ) : (
            <div className="flex items-center gap-4">
              <div className="relative group">
                <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search your projects" 
                  className="pl-10 pr-4 py-2 bg-white border border-border-color rounded-lg w-80 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg font-bold transition-all shadow-md active:scale-95">
                <Icon name="folder" className="w-5 h-5 fill-white" />
                <span>New Folder</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-border-color mb-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={`px-6 py-3 text-sm font-bold transition-all relative ${
              activeSubTab === tab ? 'text-primary' : 'text-text-muted hover:text-text-main'
            }`}
          >
            {tab}
            {activeSubTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* Shared with me specific content */}
      {activeSubTab === 'Shared with you' && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <p className="text-text-muted font-medium mb-8">Designs and folders shared by your team members.</p>
          
          {/* Stats Boxes */}
          <div className="flex flex-col md:flex-row gap-6 mb-12">
            <div className="bg-[#8b3dff] text-white p-6 rounded-3xl flex-1 flex flex-col justify-between min-h-[160px] shadow-xl shadow-primary/20 hover:-translate-y-1 transition-transform cursor-pointer">
              <Icon name="star" className="w-8 h-8 fill-white/30 text-white" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Favorites</p>
                <h3 className="text-2xl font-black">12 Items</h3>
              </div>
            </div>
            
            <div className="bg-white border border-border-color p-8 rounded-3xl flex-[3] flex justify-between items-center shadow-sm">
                <div className="text-center px-8 border-r border-gray-100 flex-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Recently Shared</p>
                    <h3 className="text-4xl font-black text-text-main">24</h3>
                </div>
                <div className="text-center px-8 border-r border-gray-100 flex-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Total Folders</p>
                    <h3 className="text-4xl font-black text-text-main">08</h3>
                </div>
                <div className="text-center px-8 flex-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Collaborators</p>
                    <h3 className="text-4xl font-black text-text-main">15</h3>
                </div>
            </div>
          </div>

          {/* Grid of Shared Items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {sharedItems.map(item => (
              <SharedItemCard key={item.id} item={item} />
            ))}
          </div>

          {/* Floating Action Button */}
          <button className="fixed bottom-10 right-10 w-14 h-14 bg-primary hover:bg-primary-hover text-white rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(139,61,255,0.4)] hover:scale-110 active:scale-95 transition-all z-50 group">
            <Icon name="userPlus" className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          </button>
        </div>
      )}

      {/* Folders and Designs content (Original) */}
      {(activeSubTab === 'Folders' || activeSubTab === 'All Projects') && (
        <div className="mb-12 animate-in fade-in duration-500">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-text-main">Folders</h2>
            <button className="text-sm font-bold text-primary hover:underline">View all</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {folders.map(folder => (
              <FolderCard key={folder.id} folder={folder} />
            ))}
            <button className="flex flex-col items-center justify-center gap-3 p-6 border-2 border-dashed border-border-color rounded-2xl hover:border-primary/50 hover:bg-primary/5 group transition-all h-full min-h-[160px]">
              <div className="w-12 h-12 rounded-full border-2 border-border-color flex items-center justify-center text-text-muted group-hover:border-primary/50 group-hover:text-primary transition-all">
                <Icon name="plus" className="w-6 h-6" />
              </div>
              <span className="font-bold text-text-muted group-hover:text-text-main">Create New Folder</span>
            </button>
          </div>
        </div>
      )}

      {(activeSubTab === 'Designs' || activeSubTab === 'All Projects') && (
        <div className="animate-in fade-in duration-500">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-text-main">Recent Designs</h2>
            <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-border-color shadow-sm">
              <button className="p-1.5 rounded text-primary bg-primary/10">
                <Icon name="grid" className="w-4 h-4" />
              </button>
              <button className="p-1.5 rounded text-text-muted hover:bg-bg-main transition-colors">
                <Icon name="layout" className="w-4 h-4" />
              </button>
            </div>
          </div>
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : designs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {designs.map(design => (
                <DesignCard key={design.id} design={design} onEdit={() => onEditDesign(design)} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <p className="text-gray-500 font-medium">No designs found. Create your first masterpiece!</p>
            </div>
          )}
        </div>
      )}

      {/* Status Bar */}
      {activeSubTab !== 'Shared with you' && (
        <div className="mt-20 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 bg-bg-main rounded-full flex items-center justify-center mb-4 border border-border-color">
            <Icon name="help" className="w-6 h-6 text-text-muted" />
          </div>
          <p className="text-text-muted text-sm mb-6">All your projects are synced and up to date.</p>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-text-muted">Storage:</span>
              <span className="font-bold text-primary">2.4 GB of 50 GB used</span>
            </div>
            <div className="w-[1px] h-4 bg-border-color" />
            <button className="font-bold text-text-main hover:text-primary transition-colors">Manage Subscription</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
