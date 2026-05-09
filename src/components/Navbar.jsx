import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      logout();
      setIsLoggingOut(false);
      navigate('/');
    }, 2000);
  };

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
      <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-lg">
            <Sparkles className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-gray-900">CanvaClone</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link to="#" className="hover:text-primary transition-colors">Features</Link>
          <Link to="#" className="hover:text-primary transition-colors">Templates</Link>
          <Link to="#" className="hover:text-primary transition-colors">Pricing</Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Dashboard</Link>
            <Link to="/editor" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Editor</Link>
            <button 
              onClick={handleLogout}
              className="btn-outline border-none hover:bg-gray-100"
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-outline hidden sm:block">Log in</Link>
            <Link to="/signup" className="btn-primary">Sign up</Link>
          </>
        )}
      </div>
    </nav>
    </>
  );
};

export default Navbar;
