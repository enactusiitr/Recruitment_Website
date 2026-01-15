import React, { useState } from 'react';
import { ChevronLeft, Upload, Calendar, Type, Link as LinkIcon, Layers, Image as ImageIcon, X, Plus, Trash2, Phone, User, Tag } from 'lucide-react';
import Header from '../components/Header';
import { toast } from 'react-hot-toast';

const CreateEventPage = ({ onBack, onSubmit }) => {
  // Complex Form State
  const [formData, setFormData] = useState({
    title: '',
    club: 'SDS Labs',
    category: 'Hackathon',
    deadline: '',
    submissionLink: '',
    overview: '',
    teamSize: '1-4',
    prizes: '₹10,000',
    tags: '', // stored as comma string
    contactName: '',
    contactPhone: '',
    bannerImage: null 
  });

  // Dynamic Rounds State
  const [rounds, setRounds] = useState([
    { title: 'Registration Ends', date: '' },
    { title: 'Round 1: Quiz', date: '' }
  ]);

  const [previewUrl, setPreviewUrl] = useState(null);

  // --- HANDLERS ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, bannerImage: file });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, bannerImage: null });
    setPreviewUrl(null);
  };

  // Round Logic
  const addRound = () => {
    setRounds([...rounds, { title: '', date: '' }]);
  };

  const removeRound = (index) => {
    const newRounds = rounds.filter((_, i) => i !== index);
    setRounds(newRounds);
  };

  const updateRound = (index, field, value) => {
    const newRounds = [...rounds];
    newRounds[index][field] = value;
    setRounds(newRounds);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Combine everything into a final object
    const finalPayload = {
      ...formData,
      timeline: rounds,
      tagList: formData.tags.split(',').map(t => t.trim()) // Convert "React, JS" to ["React", "JS"]
    };

    if (onSubmit) onSubmit(finalPayload);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans pb-20">
      <Header />

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold transition-colors">
            <ChevronLeft size={20}/> Cancel
          </button>
          <h1 className="text-2xl font-extrabold text-slate-900">Create Opportunity</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* 1. BASIC DETAILS */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">1</div>
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Event Title</label>
                <div className="relative">
                  <input required type="text" name="title" placeholder="e.g. Design Datathon 2026" className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none font-semibold text-slate-800" onChange={handleChange} />
                  <Type className="absolute left-3 top-3.5 text-slate-400" size={18}/>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Category</label>
                <div className="relative">
                  <select name="category" className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none font-semibold text-slate-800 bg-white appearance-none" onChange={handleChange}>
                    <option>Hackathon</option><option>Workshop</option><option>Competition</option><option>Cultural Event</option>
                  </select>
                  <Layers className="absolute left-3 top-3.5 text-slate-400" size={18}/>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Tags / Skills</label>
                <div className="relative">
                  <input type="text" name="tags" placeholder="Python, Design, Public Speaking..." className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none font-semibold text-slate-800" onChange={handleChange} />
                  <Tag className="absolute left-3 top-3.5 text-slate-400" size={18}/>
                </div>
              </div>
            </div>
          </div>

          {/* 2. TIMELINE & ROUNDS (NEW) */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-8">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">2</div>
              Timeline & Rounds
            </h2>
            
            <div className="space-y-4">
              {rounds.map((round, index) => (
                <div key={index} className="flex gap-4 items-start group">
                   <div className="flex-1">
                      <input 
                        type="text" 
                        placeholder="Round Title (e.g. Quiz Round)" 
                        value={round.title}
                        onChange={(e) => updateRound(index, 'title', e.target.value)}
                        className="w-full p-3 rounded-xl border border-slate-200 focus:border-purple-400 outline-none font-medium text-sm"
                      />
                   </div>
                   <div className="w-1/3">
                      <input 
                        type="date" 
                        value={round.date}
                        onChange={(e) => updateRound(index, 'date', e.target.value)}
                        className="w-full p-3 rounded-xl border border-slate-200 focus:border-purple-400 outline-none font-medium text-sm text-slate-600"
                      />
                   </div>
                   <button 
                     type="button" 
                     onClick={() => removeRound(index)}
                     className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                   >
                     <Trash2 size={18}/>
                   </button>
                </div>
              ))}

              <button 
                type="button"
                onClick={addRound}
                className="flex items-center gap-2 text-sm font-bold text-purple-600 hover:bg-purple-50 px-4 py-2 rounded-lg transition-colors mt-2"
              >
                <Plus size={16}/> Add Another Round
              </button>
            </div>
          </div>

          {/* 3. CONTENT & UPLOADS */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-8">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">3</div>
              Content & Media
            </h2>

            <div className="space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Event Banner</label>
                {!previewUrl ? (
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors relative cursor-pointer">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <div className="p-3 bg-slate-100 rounded-full"><ImageIcon size={24} /></div>
                      <p className="font-bold text-sm text-slate-600">Click to upload banner</p>
                    </div>
                  </div>
                ) : (
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 group">
                    <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover" />
                    <button type="button" onClick={removeImage} className="absolute top-3 right-3 bg-white/90 p-2 rounded-full text-rose-500 hover:text-rose-700 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"><X size={16} /></button>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Event Overview</label>
                <textarea required name="overview" rows="5" placeholder="Describe the rules, eligibility, and what participants will do..." className="w-full p-4 rounded-xl border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none font-medium text-slate-600 resize-none" onChange={handleChange}></textarea>
              </div>
              
              {/* Registration Link */}
              <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Registration Link</label>
                 <div className="relative">
                   <input type="url" name="submissionLink" placeholder="https://..." className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-400 outline-none font-medium text-blue-600" onChange={handleChange} />
                   <LinkIcon className="absolute left-3 top-3.5 text-slate-400" size={18}/>
                 </div>
              </div>
            </div>
          </div>

          {/* 4. CONTACT INFO (NEW) */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-8">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">4</div>
              Contact Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">POC Name</label>
                  <div className="relative">
                    <input type="text" name="contactName" placeholder="e.g. Aditi Sharma" className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-400 outline-none font-medium" onChange={handleChange} />
                    <User className="absolute left-3 top-3.5 text-slate-400" size={18}/>
                  </div>
               </div>
               <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">POC Phone</label>
                  <div className="relative">
                    <input type="tel" name="contactPhone" placeholder="+91 98765 43210" className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-400 outline-none font-medium" onChange={handleChange} />
                    <Phone className="absolute left-3 top-3.5 text-slate-400" size={18}/>
                  </div>
               </div>
            </div>
          </div>

          {/* SUBMIT */}
          <div className="flex justify-end pt-4 pb-12">
             <button 
               type="submit"
               className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-all transform active:scale-95 flex items-center gap-2 text-lg"
             >
               <Upload size={20}/> Publish Opportunity
             </button>
          </div>

        </form>
      </main>
    </div>
  );
};

export default CreateEventPage;