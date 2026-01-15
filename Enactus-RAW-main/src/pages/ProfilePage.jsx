import React from 'react';
import { User, BookOpen, Calendar, Award, ChevronLeft } from 'lucide-react';
import { eventsData } from '../data/mockData';

const ProfilePage = ({ registeredEventIds, onBack }) => {
  // 1. Find the full event objects based on the IDs
  const myEvents = eventsData.filter(event => registeredEventIds.includes(event.id));

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans pb-20">
      
      {/* Header / Cover */}
      <div className="bg-slate-900 h-48 relative">
        <button 
           onClick={onBack}
           className="absolute top-6 left-6 flex items-center gap-2 text-white/80 hover:text-white font-bold transition-colors"
        >
          <ChevronLeft size={20}/> Back to Home
        </button>
      </div>

      <main className="max-w-5xl mx-auto px-6 -mt-24 relative z-10">
        
        {/* 1. Student Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
           {/* Avatar */}
           <div className="w-32 h-32 rounded-full bg-slate-200 border-4 border-white shadow-lg flex items-center justify-center text-4xl overflow-hidden">
              <img src="https://ui-avatars.com/api/?name=Rohan+Das&background=0D9488&color=fff" alt="User" />
           </div>

           {/* Info */}
           <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Rohan Das</h1>
              <p className="text-slate-500 font-medium mb-4">3rd Year • Computer Science & Engineering</p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                 <span className="px-4 py-2 bg-slate-100 rounded-lg text-slate-600 text-sm font-bold flex items-center gap-2">
                    <BookOpen size={16}/> 18032044
                 </span>
                 <span className="px-4 py-2 bg-amber-50 text-amber-700 rounded-lg text-sm font-bold flex items-center gap-2 border border-amber-100">
                    <Award size={16}/> Gold Member
                 </span>
              </div>
           </div>
        </div>

        {/* 2. My Registrations Section */}
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
           <Calendar className="text-teal-600"/> Upcoming Events ({myEvents.length})
        </h2>

        {myEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {myEvents.map(event => (
                <div key={event.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex gap-4 hover:shadow-md transition-shadow">
                   {/* Mini Image */}
                   <img src={event.image} alt={event.title} className="w-24 h-24 rounded-lg object-cover bg-slate-100" />
                   
                   {/* Content */}
                   <div className="flex flex-col justify-center">
                      <span className="text-[10px] font-bold uppercase text-amber-600 mb-1">{event.category}</span>
                      <h3 className="font-bold text-slate-900 leading-tight mb-1">{event.title}</h3>
                      <p className="text-xs text-slate-500 mb-3">By {event.organizer}</p>
                      
                      <div className="flex items-center gap-2">
                         <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase">
                            Confirmed
                         </span>
                      </div>
                   </div>
                </div>
             ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-xl border border-dashed border-slate-300 text-center">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Calendar size={32}/>
             </div>
             <p className="text-slate-500 font-medium">You haven't registered for any events yet.</p>
             <button onClick={onBack} className="mt-4 text-teal-600 font-bold text-sm hover:underline">Browse Events</button>
          </div>
        )}

      </main>
    </div>
  );
};

export default ProfilePage;