import React, { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';

// --- IMPORTS ---
import Header from './components/Header'; // <--- This was likely missing
import ClubsPage from './pages/ClubsPage';
import ClubDashboard from './pages/ClubDashboard';
import EventDetailsPage from './pages/EventDetailsPage';
import RecruitmentPage from './pages/RecruitmentPage';
import CreateEventPage from './pages/CreateEventPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  // --- STATE ---
  const [selectedClub, setSelectedClub] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // Data State (Simulated Backend)
  const [registeredEventIds, setRegisteredEventIds] = useState([]);

  // --- HANDLERS ---
  const handleRegister = (event) => {
    const loadingToast = toast.loading('Registering...');
    setTimeout(() => {
      setRegisteredEventIds(prev => [...prev, event.id]);
      toast.dismiss(loadingToast);
      toast.success(`Successfully registered for ${event.title}!`, {
        duration: 4000, icon: '🎉'
      });
    }, 1500);
  };

  const handleEventSubmit = (data) => {
    console.log("New Event Data:", data);
    toast.success("Event Published Successfully!");
    setIsCreatingEvent(false);
  };

  // --- RENDER LOGIC (IF-ELSE is safer than conditional rendering) ---

  // 1. Profile Page
  if (isProfileOpen) {
    return (
      <>
        <Toaster position="top-center" />
        <ProfilePage 
          registeredEventIds={registeredEventIds}
          onBack={() => setIsProfileOpen(false)} 
        />
      </>
    );
  }

  // 2. Create Event Page
  if (isCreatingEvent) {
    return (
      <>
        <Toaster position="top-center" />
        <CreateEventPage 
          onBack={() => setIsCreatingEvent(false)}
          onSubmit={handleEventSubmit}
        />
      </>
    );
  }

  // 3. Event Details Page
  if (selectedEvent) {
    return (
      <>
        <Toaster position="top-center" />
        <EventDetailsPage 
          event={selectedEvent} 
          onBack={() => setSelectedEvent(null)}
          onRegister={() => handleRegister(selectedEvent)}
          isRegistered={registeredEventIds.includes(selectedEvent.id)}
        />
      </>
    );
  }

  // 4. Recruitment Page
  if (selectedNotice) {
    return (
      <>
        <Toaster position="top-center" />
        <RecruitmentPage 
          notice={selectedNotice}
          onBack={() => setSelectedNotice(null)}
        />
      </>
    );
  }

  // 5. Club Dashboard
  if (selectedClub) {
    return (
      <>
        <Toaster position="top-center" />
        <ClubDashboard 
          club={selectedClub} 
          onBack={() => setSelectedClub(null)}
          onEventClick={setSelectedEvent}
          onNoticeClick={setSelectedNotice}
          onPostClick={() => setIsCreatingEvent(true)}
        />
      </>
    );
  }

  // 6. Home Page (Default)
  return (
    <div>
      <Toaster position="top-center" />
      {/* We pass the profile click handler here */}
      <Header onProfileClick={() => setIsProfileOpen(true)} />
      <ClubsPage onSelectClub={setSelectedClub} />
    </div>
  );
}