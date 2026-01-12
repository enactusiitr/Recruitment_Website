import React, { useState } from 'react';
import Header from '../components/Header'; // Re-use the yellow header we made
import EventCard from '../components/EventCard';
import { eventsData } from '../data/mockData';
import { Search, Filter } from 'lucide-react';

const EventsPage = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // The categories for the top pills
  const categories = ["All", "Hackathon", "Workshop", "Competition", "Cultural Event"];

  // Logic: Filter based on Search AND Category
  const filteredEvents = eventsData.filter(event => {
    const matchesCategory = activeFilter === 'All' || event.category === activeFilter;
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          event.organizer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans">
      
      {/* 1. Official Yellow Header */}
      <Header />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        
        {/* 2. Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Explore <span className="text-amber-500">Events</span>
          </h1>
          <p className="text-slate-500 mt-2 text-lg">
            Discover workshops, hackathons, and cultural fests happening across IIT Roorkee.
          </p>
        </div>

        {/* 3. Controls (Search + Filters) */}
        <div className="flex flex-col md:flex-row gap-6 mb-10 items-start md:items-center justify-between">
          
          {/* Search Bar */}
          <div className="relative w-full md:w-96 group">
            <input 
              type="text"
              placeholder="Search by event or club..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white shadow-sm focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 transition-all text-sm font-medium"
            />
            <Search className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-amber-500 transition-colors" size={18} />
          </div>

          {/* Filter Pills */}
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold border transition-all duration-200 flex-shrink-0
                  ${activeFilter === cat 
                    ? 'bg-slate-900 text-white border-slate-900 shadow-lg scale-105' 
                    : 'bg-white text-slate-600 border-slate-200 hover:border-amber-400 hover:text-amber-600'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 4. The Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredEvents.map((event) => (
               <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 border-dashed">
             <div className="bg-amber-50 p-4 rounded-full mb-4">
                <Filter size={32} className="text-amber-400"/>
             </div>
             <h3 className="text-lg font-bold text-slate-700">No events found</h3>
             <p className="text-slate-500 text-sm">Try changing your search filters</p>
          </div>
        )}

      </main>
    </div>
  );
};

export default EventsPage;