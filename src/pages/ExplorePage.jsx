import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { designAPI } from '../api/client';
import { Search, Grid, List as ListIcon, Play, User } from 'lucide-react';
import Navbar from '../components/Navbar';

const ExplorePage = () => {
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
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Explore Community Designs</h1>
            <p className="text-gray-500 font-medium">Discover what others are creating and get inspired.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search designs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl w-64 focus:ring-2 focus:ring-purple-100 focus:border-purple-500 outline-none transition-all shadow-sm"
              />
            </div>
            <div className="flex bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-purple-50 text-purple-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-purple-50 text-purple-600' : 'text-gray-400 hover:text-gray-600'}`}
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
            <h3 className="text-xl font-bold text-gray-900 mb-2">No designs found</h3>
            <p className="text-gray-500">Try a different search term or check back later.</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8' : 'flex flex-col gap-4'}>
            {filteredDesigns.map(design => (
              <Link 
                key={design.id} 
                to={`/editor?id=${design.id}`}
                className={`group bg-white border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                  viewMode === 'grid' ? 'rounded-3xl flex flex-col' : 'rounded-2xl flex items-center p-4'
                }`}
              >
                {/* Thumbnail */}
                <div className={`${viewMode === 'grid' ? 'aspect-[4/3] w-full' : 'w-48 aspect-video rounded-xl'} bg-gray-100 overflow-hidden relative`}>
                  {design.thumbnail ? (
                    <img src={design.thumbnail} alt={design.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <Play className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full font-bold text-sm text-gray-900 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      View Design
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className={`p-5 ${viewMode === 'grid' ? 'flex-1' : 'ml-6 flex-1'}`}>
                  <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-purple-600 transition-colors line-clamp-1">{design.title}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-500">
                      <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                        <User className="w-3 h-3 text-purple-600" />
                      </div>
                      <span className="text-xs font-semibold truncate max-w-[120px]">{design.ownerEmail?.split('@')[0] || 'Community Member'}</span>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded">
                      {new Date(design.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ExplorePage;
