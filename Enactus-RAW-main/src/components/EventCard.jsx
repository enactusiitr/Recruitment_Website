import React from 'react';
import { Users, Clock, Calendar } from 'lucide-react';

const EventCard = ({ event, onClick }) => {
  return (
    <div 
      onClick={() => onClick && onClick(event)} // <--- Added Click Trigger
      className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full cursor-pointer"
    >
      
      {/* 1. Image Banner Area */}
      <div className="h-44 w-full overflow-hidden relative">
        <img 
          src={event.image} 
          alt={event.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {/* Floating Category Pill */}
        <span className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full text-slate-800 shadow-sm border border-slate-100">
          {event.category}
        </span>
      </div>

      {/* 2. Content Body */}
      <div className="p-5 flex flex-col flex-1">
        <div className="mb-4">
           {/* Organizer Name */}
           <p className="text-xs font-bold text-amber-600 uppercase tracking-wide mb-1">
             {event.organizer}
           </p>
           {/* Title */}
           <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-teal-600 transition-colors line-clamp-2">
             {event.title}
           </h3>
        </div>

        {/* 3. Footer Stats (Pinned to bottom) */}
        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-slate-500">
           {/* Registration Count */}
           <div className="flex items-center gap-1.5 text-xs font-medium bg-slate-50 px-2 py-1 rounded">
              <Users size={14} className="text-slate-400"/>
              <span>{event.registered} Registered</span>
           </div>
           
           {/* Timer / Status */}
           <div className="flex items-center gap-1.5 text-xs font-bold">
              {event.isLive ? (
                 <span className="text-amber-600 flex items-center gap-1">
                   <Clock size={14}/> {event.daysLeft} days left
                 </span>
              ) : (
                 <span className="text-rose-500 flex items-center gap-1">
                   <Calendar size={14}/> Ended
                 </span>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;