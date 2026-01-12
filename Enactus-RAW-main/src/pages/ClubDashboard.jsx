import React, { useState } from 'react';
import EventCard from '../components/EventCard';
import NoticeCard from '../components/NoticeCard';
import { eventsData, recruitmentData } from '../data/mockData';
import { ChevronLeft, Info, Plus } from 'lucide-react'; // <--- Added 'Plus' icon

const ClubDashboard = ({ club, onBack, onEventClick, onNoticeClick, onPostClick }) => { // <--- Added 'onPostClick'
  const [activeTab, setActiveTab] = useState('events');

  // Filter content specific to this club
  // Using optional chaining (?.) to prevent crashes if club data is loading
  const clubEvents = eventsData.filter(e => e.organizer === club?.name);
  const clubRecruitments = recruitmentData.filter(r => r.clubName === club?.name);

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans pb-10">
      
      {/* 1. Header Banner */}
      <div className="bg-slate-900 text-white pt-8 pb-16 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Back Button */}
          <button 
            onClick={onBack} 
            className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 text-sm font-bold transition-colors"
          >
            <ChevronLeft size={16} /> Back to Clubs
          </button>
          
          {/* Club Info */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <img 
              src={club.logo} 
              alt={club.name} 
              className="w-24 h-24 rounded-2xl border-4 border-white/10 shadow-xl bg-slate-800" 
            />
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-extrabold tracking-tight mb-2">{club.fullName}</h1>
              <p className="text-slate-400 max-w-2xl text-lg">{club.description}</p>
            </div>
          </div>
        </div>
        
        {/* Background Decorative Blob */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500 rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      </div>

      {/* 2. Navigation Tabs & Actions */}
      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-20 flex flex-wrap items-center justify-between gap-4">
        
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-1.5 inline-flex gap-1">
          {['events', 'recruitment', 'about'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold capitalize transition-all duration-200
                ${activeTab === tab 
                  ? 'bg-amber-400 text-slate-900 shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* NEW: Create Event Button */}
        <button 
          onClick={onPostClick}
          className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-xl font-bold text-sm shadow-md flex items-center gap-2 transition-all transform active:scale-95"
        >
          <Plus size={16}/> Create Event
        </button>

      </div>

      {/* 3. Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* TAB: EVENTS */}
        {activeTab === 'events' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             {clubEvents.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {clubEvents.map(event => (
                   <EventCard 
                     key={event.id} 
                     event={event} 
                     onClick={onEventClick} // Triggers Event Details Page
                   />
                 ))}
               </div>
             ) : (
               <div className="bg-white p-12 rounded-xl border border-dashed border-slate-300 text-center">
                 <p className="text-slate-500 font-medium">No upcoming events for {club.name}.</p>
               </div>
             )}
          </div>
        )}

        {/* TAB: RECRUITMENT */}
        {activeTab === 'recruitment' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             {clubRecruitments.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {clubRecruitments.map(notice => (
                   <NoticeCard 
                     key={notice.id} 
                     notice={notice} 
                     onClick={onNoticeClick} // Triggers Recruitment Page
                   />
                 ))}
               </div>
             ) : (
               <div className="bg-white p-12 rounded-xl border border-dashed border-slate-300 text-center">
                 <p className="text-slate-500 font-medium">Recruitments are currently closed.</p>
               </div>
             )}
          </div>
        )}

        {/* TAB: ABOUT */}
        {activeTab === 'about' && (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Info size={20} className="text-teal-600"/> About Us
            </h3>
            <p className="text-slate-600 leading-relaxed text-lg">
              {club.description}
            </p>
            <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6">
               <div>
                 <p className="text-xs font-bold text-slate-400 uppercase">Members</p>
                 <p className="text-xl font-bold text-slate-800">{club.members}+ Active Members</p>
               </div>
               <div>
                 <p className="text-xs font-bold text-slate-400 uppercase">Established</p>
                 <p className="text-xl font-bold text-slate-800">2014</p>
               </div>
               <div>
                 <p className="text-xs font-bold text-slate-400 uppercase">Contact</p>
                 <p className="text-xl font-bold text-slate-800 text-blue-600 underline cursor-pointer">
                   contact@{club.name.toLowerCase()}.iitr.ac.in
                 </p>
               </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default ClubDashboard;