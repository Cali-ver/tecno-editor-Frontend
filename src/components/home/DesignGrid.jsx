import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { designAPI } from '../../api/client';
import { Icon, Badge } from '../common';
import { Trash2 } from 'lucide-react';

export const DesignGrid = () => {
  const [designs, setDesigns] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        const response = await designAPI.getAll();
        setDesigns(response.data || []);
      } catch (error) {
        console.error("Failed to fetch designs", error);
      }
    };
    fetchDesigns();
  }, []);

  const handleDeleteDesign = async (e, designId) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this design?")) {
      try {
        await designAPI.delete(designId);
        setDesigns(prev => prev.filter(d => d.id !== designId));
      } catch (error) {
        console.error("Failed to delete design", error);
      }
    }
  };

  return (
    <section className="px-10 py-8">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-2xl font-black tracking-tight">Recent designs</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        {designs.slice(0, 4).map((design) => (
          <div key={design.id} className="group cursor-pointer" onClick={() => navigate(`/editor?id=${design.id}`)}>
            <div className="bg-white rounded-[1.5rem] border border-border-color overflow-hidden hover:shadow-[0_20px_50px_rgba(139,61,255,0.15)] hover:-translate-y-2 transition-all duration-500 relative">
              <div className="h-56 bg-[#f2f3f5] relative overflow-hidden flex items-center justify-center">
                {design.thumbnail ? (
                  <img src={design.thumbnail} alt={design.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                ) : (
                  <div className="text-gray-400 text-sm font-bold">No Preview</div>
                )}
                <Badge className="absolute top-4 right-4 z-10">
                  Design
                </Badge>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div className="p-6 flex items-center justify-between bg-white">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base mb-1.5 group-hover:text-primary transition-colors line-clamp-1">{design.title || 'Untitled'}</h3>
                  <p className="text-xs text-text-muted font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Modified recently
                  </p>
                </div>
                <button 
                  onClick={(e) => handleDeleteDesign(e, design.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all ml-2 flex-shrink-0"
                  title="Delete Design"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Create New Card */}
        <div className="group cursor-pointer" onClick={() => navigate('/editor')}>
          <div className="h-full min-h-[300px] bg-[#f2f3f5]/50 rounded-[1.5rem] border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-8 hover:border-primary hover:bg-primary/5 hover:shadow-xl transition-all duration-500">
              <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-text-muted group-hover:text-primary group-hover:rotate-90 group-hover:scale-110 transition-all shadow-xl mb-4">
                  <Icon name="plus" className="w-8 h-8" />
              </div>
              <p className="text-lg font-black text-text-muted group-hover:text-primary">Create New</p>
              <p className="text-sm font-medium text-gray-400 mt-2">Start from scratch</p>
          </div>
        </div>
      </div>
    </section>
  );
};;
