import React from 'react';
import { ChevronLeft, Briefcase, CheckCircle, Clock, MapPin, Share2 } from 'lucide-react';
import Header from '../components/Header';

const RecruitmentPage = ({ notice, onBack }) => {
  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans pb-20">
      <Header />

      <main className="max-w-5xl mx-auto px-6 py-8">
        
        {/* 1. Back Button */}
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 text-sm font-bold transition-colors"
        >
          <ChevronLeft size={16}/> Back to Dashboard
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Job Description */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Header Card */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
               <div className="flex items-start justify-between">
                 <div>
                   <span className="bg-purple-100 text-purple-700 border border-purple-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 inline-block">
                     {notice.type}
                   </span>
                   <h1 className="text-3xl font-extrabold text-slate-900 mb-2">{notice.title}</h1>
                   <p className="text-lg text-slate-500 font-medium">{notice.clubName} • IIT Roorkee</p>
                 </div>
                 {/* Placeholder Logo for the Club */}
                 <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center text-2xl font-bold text-slate-400">
                    {notice.clubName[0]}
                 </div>
               </div>

               <div className="flex gap-6 mt-6 pt-6 border-t border-slate-100 text-sm font-medium text-slate-500">
                  <div className="flex items-center gap-2"><Clock size={16}/> Posted {notice.timestamp}</div>
                  <div className="flex items-center gap-2"><MapPin size={16}/> On Campus</div>
                  <div className="flex items-center gap-2"><Briefcase size={16}/> Part-time</div>
               </div>
            </div>

            {/* Description Card */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
               <h3 className="text-xl font-bold text-slate-900 mb-4">Role Description</h3>
               <p className="text-slate-600 leading-relaxed mb-6 whitespace-pre-line">
                 {notice.content}
                 {/* Adding some generic filler text since mockData is short */}
                 <br/><br/>
                 As a core team member, you will work directly with the club seniors to execute projects and events. This is a great opportunity to improve your technical and managerial skills.
               </p>

               <h3 className="text-xl font-bold text-slate-900 mb-4">Who can apply?</h3>
               <ul className="space-y-3">
                 {["Open to all years (UG & PG)", "No prior experience required (for First Years)", "Dedication and willingness to learn"].map((item, i) => (
                   <li key={i} className="flex items-start gap-3 text-slate-600">
                     <CheckCircle size={18} className="text-teal-500 mt-1 shrink-0"/>
                     <span>{item}</span>
                   </li>
                 ))}
               </ul>
            </div>
          </div>

          {/* RIGHT COLUMN: Action Sidebar */}
          <div className="lg:col-span-1">
             <div className="sticky top-6 space-y-4">
                
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg">
                   <h3 className="font-bold text-slate-900 mb-1">Interested?</h3>
                   <p className="text-xs text-slate-500 mb-6">Applications are closing soon.</p>
                   
                   <button className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold py-3 rounded-xl shadow-md transition-all transform active:scale-95 mb-3">
                     Apply Now
                   </button>
                   <button className="w-full bg-white border-2 border-slate-100 hover:border-slate-300 text-slate-600 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
                     <Share2 size={18}/> Share Notice
                   </button>
                </div>

                <div className="bg-slate-900 text-white p-6 rounded-2xl">
                   <h4 className="font-bold text-lg mb-2">Selection Process</h4>
                   <ol className="text-sm text-slate-400 space-y-3 list-decimal list-inside">
                     <li>Resume Shortlisting</li>
                     <li>Technical Interview</li>
                     <li>HR / Culture Fit Round</li>
                     <li>Final Results</li>
                   </ol>
                </div>

             </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default RecruitmentPage;