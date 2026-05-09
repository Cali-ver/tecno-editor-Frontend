import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { designAPI } from '../../api/client';
import { Search, Grid, List as ListIcon, Play, User, Sparkles } from 'lucide-react';

const ExploreTab = () => {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    designAPI.getPublic()
      .then(res => {
        setDesigns(res.data);
      })
      .catch(err => console.error("Failed to fetch public designs", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredDesigns = designs.filter(d => 
    d.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 w-full animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span className="text-xs font-bold text-purple-600 uppercase tracking-widest">Community</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-1">Discover Creations</h1>
          <p className="text-gray-500 text-sm font-medium">Explore public designs from the CanvaClone community.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search designs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl w-64 focus:ring-2 focus:ring-purple-100 focus:border-purple-500 outline-none transition-all"
            />
          </div>
          <div className="flex bg-gray-50 border border-gray-200 rounded-xl p-1">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <ListIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      ) : filteredDesigns.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No public designs yet</h3>
          <p className="text-gray-500">Be the first to share your creative work with the world!</p>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'flex flex-col gap-4'}>
          {filteredDesigns.map(design => (
            <Link 
              key={design.id} 
              to={`/editor?id=${design.id}`}
              className={`group bg-white border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                viewMode === 'grid' ? 'rounded-2xl flex flex-col' : 'rounded-xl flex items-center p-3'
              }`}
            >
              {/* Thumbnail */}
              <div className={`${viewMode === 'grid' ? 'aspect-video w-full' : 'w-40 aspect-video rounded-lg'} bg-gray-100 overflow-hidden relative`}>
                {design.thumbnail ? (
                  <img src={design.thumbnail} alt={design.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <Play className="w-10 h-10" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full font-bold text-xs text-gray-900 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
                    View
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className={`p-4 ${viewMode === 'grid' ? 'flex-1' : 'ml-4 flex-1'}`}>
                <h3 className="font-bold text-gray-900 text-sm mb-2 group-hover:text-purple-600 transition-colors line-clamp-1">{design.title}</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <User className="w-3 h-3" />
                    <span className="text-[10px] font-semibold truncate max-w-[100px]">{design.ownerEmail?.split('@')[0]}</span>
                  </div>
                  <span className="text-[10px] font-medium text-gray-400">
                    {new Date(design.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExploreTab;
