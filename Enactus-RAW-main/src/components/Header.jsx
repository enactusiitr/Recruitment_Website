import React from 'react';
import { User, Bell } from 'lucide-react';

const Header = ({ onProfileClick }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold">
            C
          </div>
          <span className="font-extrabold text-xl tracking-tight text-slate-900">
            Campus<span className="text-amber-500">Connect</span>
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
          </button>
          
          {/* Profile Trigger */}
          <button 
            onClick={onProfileClick} 
            className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <User size={20} />
          </button>
        </div>

      </div>
    </header>
  );
};

export default Header;