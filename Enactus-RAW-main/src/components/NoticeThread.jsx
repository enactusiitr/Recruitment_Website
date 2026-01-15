import React, { useState } from 'react';
import { Send, Trash2, Calendar, Clock, Paperclip } from 'lucide-react';

const NoticeThread = ({ club, notices, mode, onPostNotice, onDeleteNotice }) => {
  const [newNotice, setNewNotice] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newNotice) return;
    onPostNotice(club.id, newNotice, null);
    setNewNotice("");
  };

  // 1. Empty State
  if (!club) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 text-slate-400">
        <div className="text-center p-8">
            <h3 className="text-xl font-bold text-slate-600">No Club Selected</h3>
            <p className="mt-2 text-sm">Select a club from the left to view notices</p>
        </div>
      </div>
    );
  }

  const clubNotices = notices.filter(n => n.clubId === club.id);

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50 relative">
      
      {/* 2. Thread Header (Clean White) */}
      <div className="px-8 py-6 bg-white border-b border-gray-200 sticky top-0 z-10">
        <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">{club.name}</h2>
        <p className="text-slate-500 text-sm mt-1">Official Announcements Feed</p>
      </div>

      {/* 3. The Feed (New Card Style) */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {clubNotices.length === 0 ? (
          <p className="text-center text-slate-400 mt-10">No notices yet.</p>
        ) : (
          clubNotices.map((notice) => (
            <div key={notice.id} className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-amber-400 relative group transition-all hover:shadow-md">
              
              {/* Card Header: Badge & Date */}
              <div className="flex justify-between items-start mb-3">
                <span className="px-2 py-1 bg-amber-50 text-amber-700 text-xs font-bold uppercase tracking-wider rounded border border-amber-100">
                  {club.name}
                </span>
                <div className="flex items-center gap-1 text-slate-400 text-xs font-medium">
                   <Calendar size={12}/>
                   <span>{notice.timestamp}</span>
                </div>
              </div>

              {/* Card Content */}
              <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                {notice.content}
              </p>

              {/* Delete Button (Only for Admin) - Hidden until hover */}
              {mode === 'admin' && (
                <button 
                  onClick={() => onDeleteNotice(notice.id)}
                  className="absolute top-4 right-4 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* 4. Admin Input (Teal Button Style) */}
      {mode === 'admin' && (
        <div className="p-4 bg-white border-t border-gray-200">
           <form onSubmit={handleSubmit} className="flex gap-3">
             <input 
               type="text" 
               value={newNotice}
               onChange={(e) => setNewNotice(e.target.value)}
               placeholder="Draft a new notice..." 
               className="flex-1 bg-gray-50 border border-gray-200 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
             />
             <button 
               type="submit" 
               className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-md font-bold text-sm shadow-sm transition-colors flex items-center gap-2"
             >
               POST <Send size={14}/>
             </button>
           </form>
        </div>
      )}
    </div>
  );
};

export default NoticeThread;