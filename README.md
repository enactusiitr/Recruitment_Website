# TechClubs - Student Recruitment Portal

A MERN stack website for student recruitment in technical clubs with three main features:
- **Noticeboard**: View all notices with filters
- **Recruitment**: Browse clubs and apply for membership
- **Events**: Participate in events and submit projects via Google Drive

## Project Structure

```
student-recruitment/
├── backend/
│   ├── models/
│   │   ├── Notice.js
│   │   ├── Club.js
│   │   ├── Event.js
│   │   └── Application.js
│   ├── routes/
│   │   ├── noticeRoutes.js
│   │   ├── clubRoutes.js
│   │   ├── eventRoutes.js
│   │   └── applicationRoutes.js
│   ├── server.js
│   ├── seedData.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   └── Navbar.css
│   │   ├── pages/
│   │   │   ├── Noticeboard.js
│   │   │   ├── Recruitment.js
│   │   │   ├── Events.js
│   │   │   └── Pages.css
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
└── README.md
```

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Installation & Setup

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Start MongoDB (if running locally)
mongod

# Seed the database with sample data (optional)
node seedData.js

# Start the server
npm run dev
```

The backend will run on `http://localhost:5000`

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will run on `http://localhost:3000`

## Features

### 📋 Noticeboard
- View all notices from clubs
- Filter by category (General, Recruitment, Event, Announcement, Urgent)
- Filter by priority (High, Medium, Low)
- Search notices by title or content

### 🚀 Club Recruitment
- Browse all technical clubs
- View club descriptions and requirements
- Check recruitment status and deadlines
- Apply to clubs with a simple form

### 🎯 Events & Competitions
- View upcoming events and competitions
- See problem statements and rules
- Register for events
- Submit project links via Google Drive

## API Endpoints

### Notices
- `GET /api/notices` - Get all notices (with optional filters)
- `GET /api/notices/:id` - Get single notice
- `POST /api/notices` - Create notice
- `PUT /api/notices/:id` - Update notice
- `DELETE /api/notices/:id` - Delete notice

### Clubs
- `GET /api/clubs` - Get all clubs (with optional filters)
- `GET /api/clubs/:id` - Get single club
- `POST /api/clubs` - Create club
- `PUT /api/clubs/:id` - Update club
- `DELETE /api/clubs/:id` - Delete club

### Events
- `GET /api/events` - Get all events (with optional filters)
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Applications
- `GET /api/applications` - Get all applications
- `POST /api/applications` - Create application (apply to club/event)
- `PATCH /api/applications/:id/submit` - Submit drive link for event

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/student_recruitment
```

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- CORS

### Frontend
- React 18
- React Router DOM
- Axios
- React Icons
- React Toastify

## License

MIT License
