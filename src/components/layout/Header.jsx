import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { Icon, Button } from '../common';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      logout();
      setIsLoggingOut(false);
      navigate('/');
    }, 2000);
  };

  const displayName = user?.name || user?.email?.split('@')[0] || 'User';

  return (
    <>
      {isLoggingOut && (
        <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center z-[9999] animate-fade-in">
          <style>{`
            @keyframes pulseGlow {
              0%, 100% { transform: scale(1); opacity: 0.6; filter: blur(40px); }
              50% { transform: scale(1.2); opacity: 1; filter: blur(60px); }
            }
            @keyframes textReveal {
              0% { opacity: 0; transform: translateY(20px); }
              100% { opacity: 1; transform: translateY(0); }
            }
            .animate-pulse-glow { animation: pulseGlow 3s ease-in-out infinite; }
            .animate-text-reveal { animation: textReveal 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          `}</style>
          <div className="absolute w-[300px] h-[300px] bg-red-500/20 rounded-full animate-pulse-glow -z-10"></div>
          <div className="w-16 h-16 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin mb-6"></div>
          <h1 className="text-2xl font-bold text-white animate-text-reveal">Logging out safely...</h1>
          <p className="text-sm text-gray-500 mt-2 animate-text-reveal delay-200">Thank you for creating with CanvaClone!</p>
        </div>
      )}
      <header className="h-16 bg-white/80 backdrop-blur-md border-b border-border-color flex items-center justify-between px-10 sticky top-0 z-40 transform-gpu will-change-transform">
      <div className="flex items-center gap-8">
        <nav className="flex gap-6">
          {['Templates', 'Features', 'Learn', 'Pricing'].map((link) => (
            <a 
              key={link} 
              href="#" 
              className="text-sm font-bold text-text-muted hover:text-primary transition-all relative group"
            >
              {link}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </a>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex gap-2">
          {['help', 'bell', 'settings'].map((icon) => (
            <button 
              key={icon} 
              className="w-10 h-10 flex items-center justify-center rounded-full text-text-muted hover:bg-[#f2f3f5] hover:text-text-main transition-all relative"
            >
              <Icon name={icon} className="w-5 h-5" />
              {icon === 'bell' && <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>}
            </button>
          ))}
        </div>
        
        <Button className="px-6">
          Create a design
        </Button>

        <div className="relative" ref={dropdownRef}>
          <div 
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 pl-4 border-l border-border-color group cursor-pointer"
          >
            <img 
              src={`https://ui-avatars.com/api/?name=${displayName}&background=8b3dff&color=fff`}
              alt="Profile" 
              className={`w-9 h-9 rounded-full border-2 transition-all ${showDropdown ? 'border-primary' : 'border-transparent group-hover:border-primary'}`}
            />
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-text-main">{displayName}</p>
              <p className="text-[10px] font-medium text-text-muted">Pro Account</p>
            </div>
          </div>

          {showDropdown && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100 py-2 animate-in fade-in zoom-in duration-200 z-50">
              <div className="px-4 py-3 border-b border-gray-50 mb-1">
                <p className="text-sm font-bold text-text-main">{displayName}</p>
                <p className="text-xs text-text-muted">{user?.email}</p>
              </div>
              
              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-main hover:bg-gray-50 transition-colors">
                <Icon name="user" className="w-4 h-4 text-text-muted" />
                Your Profile
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-main hover:bg-gray-50 transition-colors">
                <Icon name="settings" className="w-4 h-4 text-text-muted" />
                Settings
              </button>
              
              <div className="h-px bg-gray-50 my-1 mx-2"></div>
              
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors font-medium"
              >
                <Icon name="logout" className="w-4 h-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
    </>
  );
};

export default Header;
