import React from 'react';
import { MessageSquare, Shield, Users, ChevronRight } from 'lucide-react';

const ClubList = ({ clubs, onSelect, activeClubId, mode }) => {
  const displayClubs = mode === 'admin' 
    ? clubs.filter(c => c.isAdmin) 
    : clubs;

  return (
    <div className="w-1/3 border-r border-slate-200 bg-slate-50 h-full overflow-y-auto flex flex-col">
      {/* Header */}
      <div className="p-6 bg-white border-b border-slate-200 sticky top-0 z-10">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
          {mode === 'student' ? <MessageSquare className="text-indigo-600"/> : <Shield className="text-indigo-600"/>}
          {mode === 'student' ? 'Student Portal' : 'Admin Console'}
        </h2>
        <p className="text-sm text-slate-500 mt-2">
          {mode === 'student' ? 'Your subscribed channels' : 'Manage your organizations'}
        </p>
      </div>
      
      {/* List */}
      <ul className="flex-1 p-4 space-y-2">
        {displayClubs.map((club) => (
          <li 
            key={club.id}
            onClick={() => onSelect(club)}
            className={`group p-4 rounded-xl cursor-pointer transition-all duration-200 flex justify-between items-center border
              ${activeClubId === club.id 
                ? 'bg-white border-indigo-500 shadow-md ring-1 ring-indigo-500/20' 
                : 'bg-white border-transparent hover:border-slate-300 hover:shadow-sm'}`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${activeClubId === club.id ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                <Users size={18} />
              </div>
              <div className={`font-semibold ${activeClubId === club.id ? 'text-slate-800' : 'text-slate-600'}`}>
                {club.name}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {mode === 'student' && club.unread > 0 && (
                <span className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
                  {club.unread}
                </span>
              )}
              <ChevronRight size={16} className={`text-slate-300 transition-transform ${activeClubId === club.id ? 'translate-x-1 text-indigo-500' : 'group-hover:translate-x-1'}`} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClubList;