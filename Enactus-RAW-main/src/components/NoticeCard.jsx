import React from 'react';
import { ArrowRight } from 'lucide-react';

const NoticeCard = ({ notice, onClick }) => { // <--- Add onClick prop
  
  // Helper for tag styles
  const getTagStyle = (type) => {
    switch(type) {
      case 'Recruitment': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Event': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div 
      onClick={() => onClick && onClick(notice)} // <--- Add Trigger
      className="group bg-white rounded-xl p-6 border-l-4 border-amber-400 shadow-sm hover:shadow-md hover:border-l-8 transition-all duration-300 relative overflow-hidden cursor-pointer"
    >
      
      {/* Top Row */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex gap-2 items-center flex-wrap">
          <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider border rounded-md bg-white text-slate-700 border-slate-300">
             {notice.clubName || "CLUB"}
          </span>
          <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border rounded-full ${getTagStyle(notice.type)}`}>
            {notice.type || "Update"}
          </span>
        </div>
        <span className="text-xs font-semibold text-slate-400">
          {notice.timestamp || "Just now"}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-slate-800 mb-2 leading-tight group-hover:text-amber-600 transition-colors">
        {notice.title}
      </h3>
      
      {/* Content Preview */}
      <p className="text-slate-500 text-sm mb-5 leading-relaxed line-clamp-2">
        {notice.content}
      </p>

      {/* Footer Link */}
      <button className="text-blue-600 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
        View Role Details <ArrowRight size={14} />
      </button>

    </div>
  );
};

export default NoticeCard;