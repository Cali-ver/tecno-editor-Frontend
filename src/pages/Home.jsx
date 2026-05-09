import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Search, Monitor, Share2, Video, Palette, FileText, Layout, CreditCard, Layers, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const categories = [
  { name: 'Presentation', icon: Monitor, color: 'text-blue-500' },
  { name: 'Social Media', icon: Share2, color: 'text-pink-500' },
  { name: 'Video', icon: Video, color: 'text-red-500' },
  { name: 'Logo', icon: Palette, color: 'text-yellow-500' },
  { name: 'Poster', icon: Layout, color: 'text-green-500' },
  { name: 'Resume', icon: FileText, color: 'text-purple-500' },
  { name: 'Flyer', icon: Layers, color: 'text-orange-500' },
  { name: 'Card', icon: CreditCard, color: 'text-indigo-500' },
];

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans antialiased overflow-x-hidden relative">
      {/* Full Page Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{ 
          backgroundImage: "url('/images/vibrant_bg.png')",
          opacity: 0.6,
          zIndex: 0 
        }}
      ></div>
      {/* Dark Backdrop Blur Overlay */}
      <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-[2px] pointer-events-none" style={{ zIndex: 0 }}></div>

      <div className="relative z-10">
        <Navbar />
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float { animation: float 8s ease-in-out infinite; }
        .animate-float-delayed { animation: float 10s ease-in-out infinite; animation-delay: 2s; }
        .animate-fade-in { animation: fadeIn 1.5s ease-out forwards; }
        .animate-slide-up { animation: slideUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-slide-up-delayed { animation: slideUp 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards; opacity: 0; }
        .animate-slide-up-more-delayed { animation: slideUp 1.6s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards; opacity: 0; }
      `}</style>

      {/* Hero Section */}
      <section className="relative pt-24 pb-40 px-6 overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/30 rounded-full blur-[120px] -z-10 animate-float"></div>
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-pink-600/20 rounded-full blur-[100px] -z-10 animate-float-delayed"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h1 className="text-6xl md:text-7xl font-black tracking-tight leading-none mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent animate-slide-up">
            What will you <span className="bg-gradient-to-r from-[#8b3dff] to-[#ec4899] bg-clip-text text-transparent">design</span> today?
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto mb-12 font-semibold animate-slide-up-delayed">
            CanvaClone makes it easy to create professional designs and share them with the world.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16 max-w-md mx-auto sm:max-w-none animate-slide-up-more-delayed">
            <Link to="/signup" className="px-8 py-4 text-base font-bold rounded-full bg-gradient-to-r from-[#8b3dff] to-[#bd00ff] hover:opacity-90 hover:scale-105 transition-all shadow-lg shadow-purple-500/25 text-white text-center">
              Get Started for Free
            </Link>
            <Link to="/login" className="px-8 py-4 text-base font-bold rounded-full bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 transition-all backdrop-blur-sm text-white text-center">
              Log in
            </Link>
          </div>

          <div className="relative max-w-2xl mx-auto mb-20 shadow-[0_0_50px_rgba(139,61,255,0.15)] rounded-full animate-slide-up-more-delayed">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search for templates (Presentation, Poster, Video...)" 
              className="w-full pl-16 pr-6 py-5 rounded-full bg-white/10 border border-white/20 focus:border-primary/50 focus:bg-white/20 focus:ring-4 focus:ring-primary/20 transition-all text-lg text-white placeholder-gray-300 outline-none backdrop-blur-md"
            />
          </div>

          {/* Categories */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 max-w-6xl mx-auto animate-fade-in">
            {categories.map((cat) => (
              <button key={cat.name} className="flex flex-col items-center gap-3 group cursor-pointer">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-primary group-hover:bg-primary/10 group-hover:-translate-y-1 transition-all duration-300 shadow-sm">
                  <cat.icon className={`w-6 h-6 ${cat.color}`} />
                </div>
                <span className="text-xs font-bold text-gray-200 group-hover:text-white transition-colors">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Editor Showcase Section */}
      <section className="py-20 bg-slate-900/50 border-y border-white/5 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
              A complete design suite at your fingertips
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto font-medium">
              Everything you need to create stunning visual content in minutes. No experience required.
            </p>
          </div>

          <div className="relative mx-auto max-w-5xl rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_30px_100px_rgba(139,61,255,0.2)] bg-slate-950 group animate-fade-in">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
            <img 
              src="/images/editor_mockup.png" 
              alt="CanvaClone Editor Interface" 
              className="w-full object-cover rounded-[2rem] group-hover:scale-[1.01] transition-transform duration-1000"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 animate-fade-in">
            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 hover:border-primary/30 hover:-translate-y-2 transition-all duration-500 group">
              <div className="w-14 h-14 bg-purple-500/20 text-purple-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Palette className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Drag & Drop Editor</h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                Our intuitive editor lets you create beautiful designs in minutes, no design experience needed.
              </p>
            </div>
            
            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 hover:border-primary/30 hover:-translate-y-2 transition-all duration-500 group">
              <div className="w-14 h-14 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Thousands of Templates</h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                Choose from a vast library of professionally designed templates for any project or occasion.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 hover:border-primary/30 hover:-translate-y-2 transition-all duration-500 group">
              <div className="w-14 h-14 bg-pink-500/20 text-pink-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Video className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Easy to Share & Export</h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                Export your designs in various formats or share them directly to your social media channels.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 text-center bg-slate-950">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="bg-primary p-1.5 rounded-lg">
            <Sparkles className="text-white w-5 h-5" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">CanvaClone</span>
        </div>
        <p className="text-gray-500 text-sm font-medium">
          © {new Date().getFullYear()} CanvaClone. All rights reserved.
        </p>
      </footer>
      </div>
    </div>
  );
};

export default Home;
