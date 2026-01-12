// src/data/mockData.js

// --- 1. CLUBS LIST (8 Items) ---
export const clubsData = [
  { 
    id: 1, 
    name: "IMG", 
    fullName: "Information Management Group",
    description: "The official technical group of IIT Roorkee. We manage the institute website, Channel i, and develop campus-wide software solutions.",
    // Teal Logo
    logo: "https://ui-avatars.com/api/?name=IMG&background=0D9488&color=fff&size=200&bold=true", 
    members: 85
  },
  { 
    id: 2, 
    name: "SDS Labs", 
    fullName: "Software Development Section",
    description: "Fostering technical innovation and software development culture. Creators of Study Portal, Backdoor CTF, and more.",
    // Blue Logo
    logo: "https://ui-avatars.com/api/?name=SDS&background=2563EB&color=fff&size=200&bold=true", 
    members: 120
  },
  { 
    id: 3, 
    name: "CulSoc", 
    fullName: "Cultural Council",
    description: "The umbrella body for all cultural sections including Music, Dance, Dramatics, and Fine Arts. We bring color to campus life.",
    // Red Logo
    logo: "https://ui-avatars.com/api/?name=Cul&background=E11D48&color=fff&size=200&bold=true", 
    members: 200
  },
  { 
    id: 4, 
    name: "Finance Club", 
    fullName: "Finance Club IITR",
    description: "Spreading financial literacy and investment knowledge. We organize trading competitions, workshops, and manage a student investment fund.",
    // Amber Logo
    logo: "https://ui-avatars.com/api/?name=Fin&background=F59E0B&color=fff&size=200&bold=true", 
    members: 60
  },
  { 
    id: 5, 
    name: "E-Cell", 
    fullName: "Entrepreneurship Cell",
    description: "Fostering the startup ecosystem at IIT Roorkee. We host E-Summit, startup showcases, and mentorship sessions.",
    // Purple Logo
    logo: "https://ui-avatars.com/api/?name=E-C&background=7C3AED&color=fff&size=200&bold=true", 
    members: 95
  },
  { 
    id: 6, 
    name: "ShARE", 
    fullName: "ShARE IIT Roorkee",
    description: "A global student think-tank focusing on consulting and leadership. We work on real-world corporate case studies.",
    // Emerald Logo
    logo: "https://ui-avatars.com/api/?name=Sh&background=059669&color=fff&size=200&bold=true", 
    members: 45
  },
  { 
    id: 7, 
    name: "UBA", 
    fullName: "Unnat Bharat Abhiyan",
    description: "Inspired by the vision of transformational change in rural development processes by leveraging knowledge institutions.",
    // Orange Logo
    logo: "https://ui-avatars.com/api/?name=UBA&background=D97706&color=fff&size=200&bold=true", 
    members: 150
  },
  { 
    id: 8, 
    name: "PAG", 
    fullName: "Programming & Algo Group",
    description: "A community of competitive programmers. We host contests, discuss algorithms, and prepare for the ICPC World Finals.",
    // Slate Logo
    logo: "https://ui-avatars.com/api/?name=PAG&background=475569&color=fff&size=200&bold=true", 
    members: 70
  }
];

// --- 2. EVENTS LIST (11 Items) ---
export const eventsData = [
  // SDS Labs Events
  { 
    id: 101, title: "Botman Begins", organizer: "SDS Labs", category: "Hackathon",
    // Image: Laptop/Coding
    image: "https://picsum.photos/id/0/800/600",
    registered: 631, daysLeft: 6, isLive: true
  },
  { 
    id: 102, title: "Syntax Error v4.0", organizer: "SDS Labs", category: "Hackathon",
    // Image: Matrix/Screen
    image: "https://picsum.photos/id/60/800/600",
    registered: 450, daysLeft: 0, isLive: false
  },

  // Finance Club Events
  { 
    id: 103, title: "Big Bull Trading", organizer: "Finance Club", category: "Competition",
    // Image: Notebook/Writing
    image: "https://picsum.photos/id/20/800/600",
    registered: 1063, daysLeft: 2, isLive: true
  },
  { 
    id: 104, title: "FinLat: Finance 101", organizer: "Finance Club", category: "Workshop",
    // Image: Calculator/Desk
    image: "https://picsum.photos/id/160/800/600",
    registered: 210, daysLeft: 10, isLive: true
  },

  // CulSoc Events
  { 
    id: 105, title: "Inter-Bhawan Dance", organizer: "CulSoc", category: "Cultural Event",
    // Image: Concert/Lights
    image: "https://picsum.photos/id/158/800/600",
    registered: 240, daysLeft: 14, isLive: true
  },
  { 
    id: 106, title: "Vocal Chord '25", organizer: "CulSoc", category: "Cultural Event",
    // Image: Microphone/Stage
    image: "https://picsum.photos/id/453/800/600",
    registered: 180, daysLeft: 5, isLive: true
  },

  // IMG Events
  { 
    id: 107, title: "Design Bootcamp", organizer: "IMG", category: "Workshop",
    // Image: Computer/Design
    image: "https://picsum.photos/id/180/800/600",
    registered: 300, daysLeft: 0, isLive: false
  },

  // E-Cell Events
  { 
    id: 108, title: "E-Summit 2025", organizer: "E-Cell", category: "Conference",
    // Image: Meeting/Crowd
    image: "https://picsum.photos/id/3/800/600",
    registered: 1500, daysLeft: 20, isLive: true
  },
  { 
    id: 109, title: "Ideastorm", organizer: "E-Cell", category: "Competition",
    // Image: Lightbulb/Idea (Use abstract)
    image: "https://picsum.photos/id/532/800/600",
    registered: 80, daysLeft: 12, isLive: true
  },

  // ShARE Events
  { 
    id: 110, title: "Case Solvers League", organizer: "ShARE", category: "Competition",
    // Image: Business/Writing
    image: "https://picsum.photos/id/24/800/600",
    registered: 410, daysLeft: 8, isLive: true
  },
  
  // PAG Events
  { 
    id: 111, title: "Code Wars 2.0", organizer: "PAG", category: "Competition",
    // Image: Keyboard
    image: "https://picsum.photos/id/366/800/600",
    registered: 800, daysLeft: 1, isLive: true
  },
];

// --- 3. RECRUITMENT NOTICES (6 Items) ---
export const recruitmentData = [
  // IMG
  { 
    id: 201, clubName: "IMG", type: "Recruitment",
    title: "Designer Recruitments 2025", 
    content: "We are looking for UI/UX designers to join our team. Portfolio submission deadline is 25th March. Freshers only.",
    timestamp: "2 days ago"
  },
  { 
    id: 202, clubName: "IMG", type: "Recruitment",
    title: "Web Developer Walk-in", 
    content: "Walk-in interviews for React developers at the IMG lab (LHC). Bring your laptop.",
    timestamp: "1 week ago"
  },

  // SDS
  { 
    id: 203, clubName: "SDS Labs", type: "Recruitment",
    title: "Winter Season Auditions", 
    content: "Open auditions for backend developers (Go/Rust preferred). Open to 1st and 2nd years.",
    timestamp: "3 days ago"
  },

  // CulSoc
  { 
    id: 204, clubName: "CulSoc", type: "Recruitment",
    title: "Choreography Section Auditions", 
    content: "Do you have the moves? Auditions for the Choreo section starting this Saturday at the MAC.",
    timestamp: "5 hours ago"
  },

  // Finance Club
  { 
    id: 205, clubName: "Finance Club", type: "Recruitment",
    title: "Junior Analyst Role", 
    content: "Recruiting junior analysts for the Student Investment Fund. Must have basic knowledge of Equities.",
    timestamp: "1 day ago"
  },

  // E-Cell
  { 
    id: 206, clubName: "E-Cell", type: "Recruitment",
    title: "Campus Ambassador Program", 
    content: "Become the face of entrepreneurship on campus. Applications open for all years.",
    timestamp: "Just now"
  }
];