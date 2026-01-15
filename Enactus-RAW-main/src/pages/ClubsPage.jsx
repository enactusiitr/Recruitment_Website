import React, { useState } from 'react';
import ClubCard from '../components/ClubCard';
import { clubsData } from '../data/mockData';
import { Search, Filter } from 'lucide-react';

const ClubsPage = ({ onSelectClub }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClubs = clubsData.filter(club =>
    club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    club.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans pb-10">
      
      {/* 1. Hero Section (The Blue Bar) */}
      <div className="bg-slate-900 text-white py-12 px-6 pb-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
           <span className="text-amber-400 font-bold tracking-wider uppercase text-xs mb-2 block">
             Academic Year 2025-26
           </span>
           <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
             Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Community</span>
           </h1>
           <p className="text-slate-400 max-w-2xl text-lg">
             Explore 50+ student-run clubs, technical groups, and societies at IIT Roorkee. 
             Connect, collaborate, and create.
           </p>
        </div>
        
        {/* Decorative Blob */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600 rounded-full blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      </div>

      {/* 2. Main Content (Search & Grid) */}
      <main className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
         
         {/* Search Bar */}
         <div className="bg-white p-2 rounded-xl shadow-lg border border-slate-200 flex items-center gap-2 mb-8 max-w-2xl">
            <div className="p-3 text-slate-400">
               <Search size={20}/>
            </div>
            <input 
              type="text" 
              placeholder="Search for clubs (e.g. IMG, SDS, Dance)..." 
              className="flex-1 outline-none text-slate-700 font-medium placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-3 rounded-lg transition-colors">
               <Filter size={20}/>
            </button>
         </div>

         {/* Clubs Grid */}
         {filteredClubs.length > 0 ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
             {filteredClubs.map(club => (
               <ClubCard 
                 key={club.id} 
                 club={club} 
                 onClick={() => onSelectClub(club)} // <--- Passes click up to App.jsx
               />
             ))}
           </div>
         ) : (
           <div className="text-center py-20">
              <p className="text-slate-400 text-lg">No clubs found matching "{searchTerm}"</p>
              <button 
                onClick={() => setSearchTerm('')}
                className="mt-4 text-teal-600 font-bold hover:underline"
              >
                Clear Search
              </button>
           </div>
         )}
      </main>
    </div>
  );
};

export default ClubsPage;