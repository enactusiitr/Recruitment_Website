import React from 'react';
import { Users, ChevronRight } from 'lucide-react';

const ClubCard = ({ club, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="group bg-white rounded-2xl border border-slate-200 p-6 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
    >
      <div className="flex items-start justify-between mb-4">
        {/* Logo */}
        <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 p-1 flex items-center justify-center">
          <img src={club.logo} alt={club.name} className="w-full h-full rounded-xl object-cover" />
        </div>
        
        {/* Member Badge */}
        <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1">
          <Users size={12} /> {club.members}
        </span>
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-amber-600 transition-colors">
        {club.name}
      </h3>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">
        {club.fullName}
      </p>
      
      <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed mb-4">
        {club.description}
      </p>

      <div className="flex items-center text-teal-600 text-sm font-bold group-hover:gap-2 transition-all">
        View Dashboard <ChevronRight size={16} />
      </div>
    </div>
  );
};

export default ClubCard;