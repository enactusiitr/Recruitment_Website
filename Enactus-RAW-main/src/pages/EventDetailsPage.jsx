import React from 'react';
import { Calendar, Clock, MapPin, Users, Award, Share2, ChevronLeft } from 'lucide-react';
import Header from '../components/Header';

const EventDetailsPage = ({ event, onBack, onRegister, isRegistered }) => {
  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans pb-20">
      <Header />

      {/* Hero Banner Area */}
      <div className="h-64 md:h-80 w-full relative bg-slate-900">
        <img 
          src={event.image} 
          alt={event.title} 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
        
        {/* Back Button */}
        <div className="absolute top-6 left-6 md:left-12 z-10">
           <button 
             onClick={onBack}
             className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full backdrop-blur-md transition-all text-sm font-bold border border-white/10"
           >
             <ChevronLeft size={16}/> Back
           </button>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
           <div className="max-w-7xl mx-auto">
             <span className="bg-amber-400 text-slate-900 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider mb-3 inline-block">
               {event.category}
             </span>
             <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">{event.title}</h1>
             <p className="text-slate-300 font-medium text-lg flex items-center gap-2">
               Organized by <span className="text-white font-bold">{event.organizer}</span>
             </p>
           </div>
        </div>
      </div>

      {/* Main Layout */}
      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Details */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Quick Info Bar */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-6 md:gap-12">
             <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Calendar size={20}/></div>
                <div>
                   <p className="text-xs text-slate-500 font-bold uppercase">Date</p>
                   <p className="font-bold text-slate-800">24-26 March 2026</p>
                </div>
             </div>
             <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-lg"><MapPin size={20}/></div>
                <div>
                   <p className="text-xs text-slate-500 font-bold uppercase">Venue</p>
                   <p className="font-bold text-slate-800">MAC Auditorium</p>
                </div>
             </div>
             <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><Users size={20}/></div>
                <div>
                   <p className="text-xs text-slate-500 font-bold uppercase">Team Size</p>
                   <p className="font-bold text-slate-800">1 - 4 Members</p>
                </div>
             </div>
          </div>

          {/* About Section */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
             <h3 className="text-xl font-extrabold text-slate-900 mb-4">About the Event</h3>
             <p className="text-slate-600 leading-relaxed mb-6 text-lg">
               Get ready for the biggest {event.category.toLowerCase()} of the year! {event.title} brings together the brightest minds of IIT Roorkee to compete, innovate, and win. 
               Whether you are a beginner or a pro, this is your stage to shine.
             </p>
             <h4 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wide">What to expect:</h4>
             <ul className="list-disc list-inside text-slate-600 space-y-2 marker:text-amber-500 ml-2">
               <li>24-hour intense competition window.</li>
               <li>Mentorship from industry experts.</li>
               <li>Networking opportunities with alumni.</li>
               <li>Free food and swag for all participants!</li>
             </ul>
          </div>

          {/* Prizes Section */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
             <h3 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center gap-2">
               <Award className="text-amber-500"/> Prizes & Rewards
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-b from-yellow-50 to-white p-4 rounded-xl border border-yellow-200 text-center transform hover:scale-105 transition-transform">
                   <div className="text-4xl mb-2">🥇</div>
                   <h4 className="font-black text-slate-800 text-xl">₹25,000</h4>
                   <p className="text-xs text-slate-500 uppercase font-bold mt-1">Winner</p>
                </div>
                <div className="bg-gradient-to-b from-slate-50 to-white p-4 rounded-xl border border-slate-200 text-center transform hover:scale-105 transition-transform">
                   <div className="text-4xl mb-2">🥈</div>
                   <h4 className="font-black text-slate-800 text-xl">₹15,000</h4>
                   <p className="text-xs text-slate-500 uppercase font-bold mt-1">Runner Up</p>
                </div>
                <div className="bg-gradient-to-b from-orange-50 to-white p-4 rounded-xl border border-orange-200 text-center transform hover:scale-105 transition-transform">
                   <div className="text-4xl mb-2">🥉</div>
                   <h4 className="font-black text-slate-800 text-xl">₹5,000</h4>
                   <p className="text-xs text-slate-500 uppercase font-bold mt-1">2nd Runner Up</p>
                </div>
             </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Sticky Action Card */}
        <div className="lg:col-span-1">
           <div className="sticky top-6 bg-white rounded-2xl border border-slate-200 shadow-lg p-6">
              <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-6">
                 <div>
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Registration Deadline</p>
                    <p className="text-slate-800 font-bold flex items-center gap-2">
                      <Clock size={16} className="text-rose-500"/> {event.daysLeft} Days Left
                    </p>
                 </div>
                 <div className="text-right">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Registered</p>
                    <p className="text-slate-800 font-bold">{event.registered}</p>
                 </div>
              </div>

              {/* DYNAMIC REGISTER BUTTON */}
              {isRegistered ? (
                 <button 
                   disabled
                   className="w-full bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold py-4 rounded-xl mb-3 text-lg cursor-not-allowed flex items-center justify-center gap-2"
                 >
                   ✅ Registered
                 </button>
              ) : (
                 <button 
                   onClick={onRegister}
                   className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-teal-200 transition-all transform active:scale-95 mb-3 text-lg"
                 >
                   Register Now
                 </button>
              )}
              
              <button className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 border border-slate-200">
                 <Share2 size={18}/> Share Event
              </button>

              <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                 <p className="text-xs text-slate-400 leading-normal">
                    By registering, you agree to the rules and regulations set by {event.organizer} and IIT Roorkee.
                 </p>
              </div>
           </div>
        </div>

      </main>
    </div>
  );
};

export default EventDetailsPage;