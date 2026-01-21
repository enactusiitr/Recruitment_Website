import React, { useState, useEffect } from 'react';
import { 
  FaBullhorn, FaUsers, FaCalendarAlt, FaPlus, FaTimes, FaEye, FaEdit, FaTrash,
  FaClipboardList, FaClock, FaFileExcel, FaGoogle
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { noticeAPI, clubAPI, eventAPI, applicationAPI, submissionAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import * as XLSX from 'xlsx';

const ClubAdmin = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('notices');
  const [loading, setLoading] = useState(false);
  
  // Data states
  const [notices, setNotices] = useState([]);
  const [recruitments, setRecruitments] = useState([]);
  const [events, setEvents] = useState([]);
  const [applications, setApplications] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  
  // Modal states
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [showRecruitmentModal, setShowRecruitmentModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showResponsesModal, setShowResponsesModal] = useState(false);
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [responseType, setResponseType] = useState('');
  
  // Form states
  const [noticeForm, setNoticeForm] = useState({
    title: '',
    content: '',
    category: 'General'
  });
  
  const [recruitmentForm, setRecruitmentForm] = useState({
    name: '',
    role: '',  // Changed from 'category' to 'role' to avoid conflict with club's category
    description: '',
    requirements: '',
    recruitmentDeadline: '',
    googleFormLink: '',
    isRecruiting: true
  });
  
  const [eventForm, setEventForm] = useState({
    name: '',
    problemStatement: '',
    description: '',
    eventDate: '',
    registrationDeadline: '',
    submissionDeadline: '',
    registrationFormLink: '',
    submissionFormLink: '',
    prizes: '',
    rules: '',
    isActive: true
  });

  const categories = ['General', 'Event', 'Recruitment', 'Announcement'];

  const toEndOfDayISO = (value) => {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    date.setHours(23, 59, 59, 999);
    return date.toISOString();
  };

  // Helper to convert to title case
  const toTitleCase = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }
    
    // Debug: Log user info
    console.log('ClubAdmin - User info:', {
      name: user.name,
      email: user.email,
      club: user.club,
      role: user.role
    });
    
    // Check if user has email
    if (!user.email) {
      console.warn('Warning: User object is missing email. User should re-login.');
      toast.warning('Please log out and log in again to refresh your session.');
    }
    
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user, activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'notices') {
        const res = await noticeAPI.getAll({ clubName: user.club });
        // Filter to only show notices created by this club
        const filteredNotices = res.data.filter(n => n.clubName === user.club);
        setNotices(filteredNotices);
      } else if (activeTab === 'recruitments') {
        const res = await clubAPI.getAll({ name: user.club });
        // Filter to only show recruitments for this club that have isRecruiting explicitly set
        // A club entry should only appear here if the admin has posted a recruitment (isRecruiting: true)
        const filteredRecruitments = res.data.filter(r => r.name === user.club && r.isRecruiting === true);
        setRecruitments(filteredRecruitments);
      } else if (activeTab === 'events') {
        const res = await eventAPI.getAll({ clubName: user.club });
        // Filter to only show events created by this club
        const filteredEvents = res.data.filter(e => e.clubName === user.club);
        setEvents(filteredEvents);
      } else if (activeTab === 'responses') {
        // Load all data to filter applications by club's items
        const [appsRes, clubsRes, eventsRes] = await Promise.all([
          applicationAPI.getAll(),
          clubAPI.getAll({ name: user.club }),
          eventAPI.getAll({ clubName: user.club })
        ]);
        
        // Get IDs of club's recruitments and events
        const clubRecruitmentIds = clubsRes.data
          .filter(r => r.name === user.club)
          .map(r => r._id);
        const clubEventIds = eventsRes.data
          .filter(e => e.clubName === user.club)
          .map(e => e._id);
        
        // Filter applications to only show those for this club's items
        const filteredApps = appsRes.data.filter(app => 
          (app.type === 'club' && clubRecruitmentIds.includes(app.referenceId)) ||
          (app.type === 'event' && clubEventIds.includes(app.referenceId))
        );
        setApplications(filteredApps);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Notice handlers
  const handleNoticeSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...noticeForm,
        clubName: user.club
      };
      
      if (selectedItem) {
        await noticeAPI.update(selectedItem._id, data);
        toast.success('Notice updated successfully!');
      } else {
        await noticeAPI.create(data);
        toast.success('Notice posted successfully!');
      }
      
      setShowNoticeModal(false);
      resetNoticeForm();
      loadData();
    } catch (error) {
      console.error('Error saving notice:', error);
      toast.error('Failed to save notice');
    }
  };

  const handleDeleteNotice = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notice?')) return;
    try {
      await noticeAPI.delete(id);
      toast.success('Notice deleted successfully!');
      loadData();
    } catch (error) {
      toast.error('Failed to delete notice');
    }
  };

  // Recruitment handlers
  const handleRecruitmentSubmit = async (e) => {
    e.preventDefault();
    
    // Validate that user has email
    if (!user || !user.email) {
      toast.error('User email is required. Please log out and log in again.');
      return;
    }
    
    try {
      // Prepare recruitment data
      const data = {
        name: user.club,
        role: recruitmentForm.role,
        description: recruitmentForm.description || `Join ${user.club}`,
        category: 'other',  // Default category
        contactEmail: user.email,  // Use admin's email
        requirements: recruitmentForm.requirements,
        recruitmentDeadline: toEndOfDayISO(recruitmentForm.recruitmentDeadline),
        googleFormLink: recruitmentForm.googleFormLink || '',
        isRecruiting: recruitmentForm.isRecruiting !== false  // Use form value
      };
      
      console.log('Submitting recruitment data:', data);
      
      // If editing an existing recruitment, use selectedItem._id
      if (selectedItem && selectedItem._id) {
        await clubAPI.update(selectedItem._id, data);
        toast.success('Recruitment updated successfully!');
      } else {
        // Creating new - check if club exists in Club collection (include inactive to find all)
        const clubsResponse = await clubAPI.getAll({ name: user.club, includeInactive: true });
        const existingClub = clubsResponse.data.find(c => c.name === user.club);
        
        if (existingClub && existingClub._id) {
          // Club exists in DB with actual ObjectId, update it
          console.log('Updating existing club:', existingClub._id);
          await clubAPI.update(existingClub._id, data);
        } else {
          // Club doesn't exist in DB, create it
          console.log('Creating new club recruitment');
          await clubAPI.create(data);
        }
        toast.success('Recruitment posted successfully!');
      }
      
      setShowRecruitmentModal(false);
      resetRecruitmentForm();
      loadData();
    } catch (error) {
      console.error('Error saving recruitment:', error);
      toast.error(error.response?.data?.message || 'Failed to save recruitment');
    }
  };

  const handleDeleteRecruitment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this recruitment?')) return;
    try {
      await clubAPI.delete(id);
      toast.success('Recruitment deleted successfully!');
      loadData();
    } catch (error) {
      toast.error('Failed to delete recruitment');
    }
  };

  // Event handlers
  const handleEventSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...eventForm,
        clubName: user.club,
        registrationDeadline: toEndOfDayISO(eventForm.registrationDeadline),
        submissionDeadline: toEndOfDayISO(eventForm.submissionDeadline),
        registrationFormLink: eventForm.registrationFormLink || '',
        submissionFormLink: eventForm.submissionFormLink || ''
      };
      
      if (selectedItem) {
        await eventAPI.update(selectedItem._id, data);
        toast.success('Event updated successfully!');
      } else {
        await eventAPI.create(data);
        toast.success('Event posted successfully!');
      }
      
      setShowEventModal(false);
      resetEventForm();
      loadData();
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error('Failed to save event');
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await eventAPI.delete(id);
      toast.success('Event deleted successfully!');
      loadData();
    } catch (error) {
      toast.error('Failed to delete event');
    }
  };

  // Response handlers
  const viewResponses = async (item, type) => {
    setSelectedItem(item);
    setResponseType(type);
    setShowResponsesModal(true);
    
    // Fetch latest applications when opening the modal
    try {
      const [appsRes, clubsRes, eventsRes] = await Promise.all([
        applicationAPI.getAll(),
        clubAPI.getAll({ name: user.club }),
        eventAPI.getAll({ clubName: user.club })
      ]);
      
      // Get IDs of club's recruitments and events
      const clubRecruitmentIds = clubsRes.data
        .filter(r => r.name === user.club)
        .map(r => r._id);
      const clubEventIds = eventsRes.data
        .filter(e => e.clubName === user.club)
        .map(e => e._id);
      
      // Filter applications to only show those for this club's items
      const filteredApps = appsRes.data.filter(app => 
        (app.type === 'club' && clubRecruitmentIds.includes(app.referenceId)) ||
        (app.type === 'event' && clubEventIds.includes(app.referenceId))
      );
      setApplications(filteredApps);
    } catch (error) {
      console.error('Error fetching latest applications:', error);
    }
  };

  const viewSubmissions = async (event) => {
    setSelectedItem(event);
    setShowSubmissionsModal(true);
    
    // Fetch latest submissions for this event
    try {
      const response = await submissionAPI.getByEventId(event._id);
      setSubmissions(response.data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      setSubmissions([]);
    }
  };

  const getFilteredApplications = () => {
    if (!selectedItem) return [];
    return applications.filter(app => 
      app.referenceId === selectedItem._id && 
      app.type === responseType
    );
  };

  // Export functions
  const formatApplicationsForExport = (apps) => {
    return apps.map(app => ({
      'Type': app.type === 'club' ? 'Recruitment' : 'Event',
      'Student Name': app.studentName,
      'Email': app.email,
      'WhatsApp No': app.whatsappNo || app.phone || '',
      'Branch': app.branch,
      'Year': app.year,
      'Enrollment No': app.enrollmentNo || app.rollNumber || '',
      'Message': app.message || '',
      'Drive Link': app.driveLink || '',
      'Status': app.status,
      'Applied Date': formatDate(app.createdAt)
    }));
  };

  const formatSubmissionsForExport = (subs) => {
    return subs.map(sub => ({
      'Student Name': sub.studentName,
      'Email': sub.email,
      'Enrollment No': sub.enrollmentNo,
      'Year': sub.year,
      'Branch': sub.branch,
      'Drive Link': sub.driveLink,
      'Submitted Date': formatDate(sub.createdAt)
    }));
  };

  const exportToExcel = (apps, filename = 'applications') => {
    if (apps.length === 0) {
      toast.warning('No applications to export');
      return;
    }
    
    const exportData = formatApplicationsForExport(apps);
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Applications');
    
    // Auto-size columns
    const maxWidth = exportData.reduce((acc, row) => {
      Object.keys(row).forEach((key, i) => {
        const len = Math.max(key.length, String(row[key]).length);
        acc[i] = Math.max(acc[i] || 10, len + 2);
      });
      return acc;
    }, []);
    worksheet['!cols'] = maxWidth.map(w => ({ wch: Math.min(w, 50) }));
    
    XLSX.writeFile(workbook, `${filename}_${user.club}_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success('Exported to Excel successfully!');
  };

  const exportSubmissionsToExcel = (subs, filename = 'submissions') => {
    if (subs.length === 0) {
      toast.warning('No submissions to export');
      return;
    }
    
    const exportData = formatSubmissionsForExport(subs);
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Submissions');
    
    // Auto-size columns
    const maxWidth = exportData.reduce((acc, row) => {
      Object.keys(row).forEach((key, i) => {
        const len = Math.max(key.length, String(row[key]).length);
        acc[i] = Math.max(acc[i] || 10, len + 2);
      });
      return acc;
    }, []);
    worksheet['!cols'] = maxWidth.map(w => ({ wch: Math.min(w, 50) }));
    
    XLSX.writeFile(workbook, `${filename}_${user.club}_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success('Exported to Excel successfully!');
  };

  const exportToGoogleSheets = (apps, title = 'Applications') => {
    if (apps.length === 0) {
      toast.warning('No applications to export');
      return;
    }

    const exportData = formatApplicationsForExport(apps);
    
    // Create CSV content for Google Sheets import
    const headers = Object.keys(exportData[0]);
    const csvContent = [
      headers.join(','),
      ...exportData.map(row => 
        headers.map(h => {
          let cell = String(row[h] || '');
          // Escape quotes and wrap in quotes if contains comma or newline
          if (cell.includes(',') || cell.includes('\n') || cell.includes('"')) {
            cell = '"' + cell.replace(/"/g, '""') + '"';
          }
          return cell;
        }).join(',')
      )
    ].join('\n');

    // Create blob and generate download, then open Google Sheets
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title}_${user.club}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Open Google Sheets with import instructions
    toast.info('CSV downloaded! Open Google Sheets and use File → Import to upload', {
      autoClose: 5000
    });
    
    // Open Google Sheets in new tab
    setTimeout(() => {
      window.open('https://sheets.google.com/create', '_blank');
    }, 1000);
  };

  const exportSubmissionsToGoogleSheets = (subs, title = 'Submissions') => {
    if (subs.length === 0) {
      toast.warning('No submissions to export');
      return;
    }

    const exportData = formatSubmissionsForExport(subs);
    
    // Create CSV content for Google Sheets import
    const headers = Object.keys(exportData[0]);
    const csvContent = [
      headers.join(','),
      ...exportData.map(row => 
        headers.map(h => {
          let cell = String(row[h] || '');
          // Escape quotes and wrap in quotes if contains comma or newline
          if (cell.includes(',') || cell.includes('\n') || cell.includes('"')) {
            cell = '"' + cell.replace(/"/g, '""') + '"';
          }
          return cell;
        }).join(',')
      )
    ].join('\n');

    // Create blob and generate download, then open Google Sheets
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title}_${user.club}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Open Google Sheets with import instructions
    toast.info('CSV downloaded! Open Google Sheets and use File → Import to upload', {
      autoClose: 5000
    });
    
    // Open Google Sheets in new tab
    setTimeout(() => {
      window.open('https://sheets.google.com/create', '_blank');
    }, 1000);
  };

  // Form helpers
  const resetNoticeForm = () => {
    setNoticeForm({ title: '', content: '', category: 'General' });
    setSelectedItem(null);
  };

  const resetRecruitmentForm = () => {
    setRecruitmentForm({
      name: '',
      role: '',
      description: '',
      requirements: '',
      recruitmentDeadline: '',
      googleFormLink: '',
      isRecruiting: true
    });
    setSelectedItem(null);
  };

  const resetEventForm = () => {
    setEventForm({
      name: '',
      problemStatement: '',
      description: '',
      eventDate: '',
      registrationDeadline: '',
      submissionDeadline: '',
      registrationFormLink: '',
      submissionFormLink: '',
      prizes: '',
      rules: '',
      isActive: true
    });
    setSelectedItem(null);
  };

  const openEditNotice = (notice) => {
    setSelectedItem(notice);
    setNoticeForm({
      title: notice.title,
      content: notice.content,
      category: notice.category
    });
    setShowNoticeModal(true);
  };

  const openEditRecruitment = (recruitment) => {
    setSelectedItem(recruitment);
    setRecruitmentForm({
      name: recruitment.name,
      role: recruitment.role || '',
      description: recruitment.description || '',
      requirements: recruitment.requirements || '',
      recruitmentDeadline: recruitment.recruitmentDeadline?.split('T')[0] || '',
      googleFormLink: recruitment.googleFormLink || '',
      isRecruiting: recruitment.isRecruiting
    });
    setShowRecruitmentModal(true);
  };

  const openEditEvent = (event) => {
    setSelectedItem(event);
    setEventForm({
      name: event.name,
      problemStatement: event.problemStatement || '',
      description: event.description || '',
      eventDate: event.eventDate?.split('T')[0] || '',
      registrationDeadline: event.registrationDeadline?.split('T')[0] || '',
      submissionDeadline: event.submissionDeadline?.split('T')[0] || '',
      registrationFormLink: event.registrationFormLink || '',
      submissionFormLink: event.submissionFormLink || '',
      prizes: event.prizes || '',
      rules: event.rules || '',
      isActive: event.isActive
    });
    setShowEventModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className={`admin-page light-theme`}>
      <div className="admin-container">
        <div className="admin-header">
          <div className="header-left">
            <div className="club-logo-badge">{user.club?.charAt(0)}</div>
            <div>
              <h1>{user.club} Admin Panel</h1>
              <p>Manage notices, recruitments, and events</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          <button 
            className={`tab-btn ${activeTab === 'notices' ? 'active' : ''}`}
            onClick={() => setActiveTab('notices')}
          >
            <FaBullhorn /> Notices
          </button>
          <button 
            className={`tab-btn ${activeTab === 'recruitments' ? 'active' : ''}`}
            onClick={() => setActiveTab('recruitments')}
          >
            <FaUsers /> Recruitments
          </button>
          <button 
            className={`tab-btn ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            <FaCalendarAlt /> Events
          </button>
          <button 
            className={`tab-btn ${activeTab === 'responses' ? 'active' : ''}`}
            onClick={() => setActiveTab('responses')}
          >
            <FaClipboardList /> All Responses
          </button>
        </div>

        {/* Content */}
        <div className="admin-content">
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : (
            <>
              {/* Notices Tab */}
              {activeTab === 'notices' && (
                <div className="tab-content">
                  <div className="content-header">
                    <h2>Manage Notices</h2>
                    <button className="btn btn-primary" onClick={() => { resetNoticeForm(); setShowNoticeModal(true); }}>
                      <FaPlus /> Post Notice
                    </button>
                  </div>
                  
                  {notices.length === 0 ? (
                    <div className="empty-state">
                      <FaBullhorn className="empty-icon" />
                      <h3>No Notices</h3>
                      <p>Post your first notice to get started</p>
                    </div>
                  ) : (
                    <div className="items-list">
                      {notices.map(notice => (
                        <div key={notice._id} className="item-card">
                          <div className="item-info">
                            <span className={`category-badge cat-${notice.category?.toLowerCase()}`}>{toTitleCase(notice.category || 'general')}</span>
                            <h3>{notice.title}</h3>
                            <p>{notice.content?.substring(0, 100)}...</p>
                            <span className="date-info"><FaClock /> {formatDate(notice.createdAt)}</span>
                          </div>
                          <div className="item-actions">
                            <button className="action-btn edit-btn" onClick={() => openEditNotice(notice)}>
                              <FaEdit />
                            </button>
                            <button className="action-btn delete-btn" onClick={() => handleDeleteNotice(notice._id)}>
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Recruitments Tab */}
              {activeTab === 'recruitments' && (
                <div className="tab-content">
                  <div className="content-header">
                    <h2>Manage Recruitments</h2>
                    <button className="btn btn-primary" onClick={() => { resetRecruitmentForm(); setShowRecruitmentModal(true); }}>
                      <FaPlus /> Post Recruitment
                    </button>
                  </div>
                  
                  {recruitments.length === 0 ? (
                    <div className="empty-state">
                      <FaUsers className="empty-icon" />
                      <h3>No Recruitments</h3>
                      <p>Post a recruitment to start accepting applications</p>
                    </div>
                  ) : (
                    <div className="items-list">
                      {recruitments.map(rec => (
                        <div key={rec._id} className="item-card">
                          <div className="item-info">
                            <span className={`status-badge ${rec.isRecruiting ? 'active' : 'inactive'}`}>
                              {rec.isRecruiting ? 'Recruiting' : 'Closed'}
                            </span>
                            <h3>{rec.role || 'Open Position'} - {rec.name}</h3>
                            <p>{rec.description?.substring(0, 100) || rec.requirements?.substring(0, 100)}...</p>
                            <span className="date-info"><FaClock /> Deadline: {formatDate(rec.recruitmentDeadline)}</span>
                          </div>
                          <div className="item-actions">
                            <button className="action-btn view-btn" onClick={() => viewResponses(rec, 'club')}>
                              <FaEye /> Responses
                            </button>
                            <button className="action-btn edit-btn" onClick={() => openEditRecruitment(rec)}>
                              <FaEdit />
                            </button>
                            <button className="action-btn delete-btn" onClick={() => handleDeleteRecruitment(rec._id)}>
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Events Tab */}
              {activeTab === 'events' && (
                <div className="tab-content">
                  <div className="content-header">
                    <h2>Manage Events</h2>
                    <button className="btn btn-primary" onClick={() => { resetEventForm(); setShowEventModal(true); }}>
                      <FaPlus /> Post Event
                    </button>
                  </div>
                  
                  {events.length === 0 ? (
                    <div className="empty-state">
                      <FaCalendarAlt className="empty-icon" />
                      <h3>No Events</h3>
                      <p>Create an event to engage with students</p>
                    </div>
                  ) : (
                    <div className="items-list">
                      {events.map(event => (
                        <div key={event._id} className="item-card">
                          <div className="item-info">
                            <span className={`status-badge ${event.isActive ? 'active' : 'inactive'}`}>
                              {event.isActive ? 'Active' : 'Ended'}
                            </span>
                            <h3>{event.name}</h3>
                            <p>{event.description?.substring(0, 100)}...</p>
                            <span className="date-info"><FaCalendarAlt /> Event: {formatDate(event.eventDate)}</span>
                          </div>
                          <div className="item-actions">
                            <button className="action-btn view-btn" onClick={() => viewResponses(event, 'event')}>
                              <FaUsers /> Registrations
                            </button>
                            <button className="action-btn view-btn" onClick={() => viewSubmissions(event)}>
                              <FaClipboardList /> Submissions
                            </button>
                            <button className="action-btn edit-btn" onClick={() => openEditEvent(event)}>
                              <FaEdit />
                            </button>
                            <button className="action-btn delete-btn" onClick={() => handleDeleteEvent(event._id)}>
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* All Responses Tab */}
              {activeTab === 'responses' && (
                <div className="tab-content">
                  <div className="content-header">
                    <h2>All Applications</h2>
                    <div className="export-buttons">
                      <button 
                        className="btn btn-export excel"
                        onClick={() => exportToExcel(applications, 'all_applications')}
                        disabled={applications.length === 0}
                      >
                        <FaFileExcel /> Export Excel
                      </button>
                      <button 
                        className="btn btn-export sheets"
                        onClick={() => exportToGoogleSheets(applications, 'all_applications')}
                        disabled={applications.length === 0}
                      >
                        <FaGoogle /> Export to Sheets
                      </button>
                    </div>
                  </div>
                  
                  {applications.length === 0 ? (
                    <div className="empty-state">
                      <FaClipboardList className="empty-icon" />
                      <h3>No Applications</h3>
                      <p>No applications have been submitted yet</p>
                    </div>
                  ) : (
                    <div className="responses-table-container">
                      <table className="responses-table">
                        <thead>
                          <tr>
                            <th>Type</th>
                            <th>Student Name</th>
                            <th>Email</th>
                            <th>WhatsApp</th>
                            <th>Branch</th>
                            <th>Year</th>
                            <th>Enrollment No</th>
                            <th>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {applications.map(app => (
                            <tr key={app._id}>
                              <td><span className={`type-badge ${app.type}`}>{app.type}</span></td>
                              <td>{app.studentName}</td>
                              <td>{app.email}</td>
                              <td>{app.whatsappNo || app.phone || '-'}</td>
                              <td>{app.branch}</td>
                              <td>{app.year}</td>
                              <td>{app.enrollmentNo || app.rollNumber || '-'}</td>
                              <td>{formatDate(app.createdAt)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Notice Modal */}
      {showNoticeModal && (
        <div className="modal-overlay" onClick={() => setShowNoticeModal(false)}>
          <div className={`admin-modal light-modal`} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><FaBullhorn /> {selectedItem ? 'Edit Notice' : 'Post Notice'}</h2>
              <button className="modal-close" onClick={() => setShowNoticeModal(false)}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleNoticeSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={noticeForm.title}
                  onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                  placeholder="Notice title"
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  value={noticeForm.category}
                  onChange={(e) => setNoticeForm({ ...noticeForm, category: e.target.value })}
                  required
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Content</label>
                <textarea
                  value={noticeForm.content}
                  onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })}
                  placeholder="Notice content..."
                  rows={5}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowNoticeModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {selectedItem ? 'Update' : 'Post'} Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Recruitment Modal */}
      {showRecruitmentModal && (
        <div className="modal-overlay" onClick={() => setShowRecruitmentModal(false)}>
          <div className={`admin-modal light-modal`} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><FaUsers /> {selectedItem ? 'Edit Recruitment' : 'Post Recruitment'}</h2>
              <button className="modal-close" onClick={() => setShowRecruitmentModal(false)}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleRecruitmentSubmit}>
              <div className="form-group">
                <label>Role / Position</label>
                <input
                  type="text"
                  value={recruitmentForm.role}
                  onChange={(e) => setRecruitmentForm({ ...recruitmentForm, role: e.target.value })}
                  placeholder="e.g., Technical Lead, Marketing Head, Designer..."
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={recruitmentForm.description}
                  onChange={(e) => setRecruitmentForm({ ...recruitmentForm, description: e.target.value })}
                  placeholder="Role description..."
                  rows={3}
                />
              </div>
              <div className="form-group">
                <label>Requirements</label>
                <textarea
                  value={recruitmentForm.requirements}
                  onChange={(e) => setRecruitmentForm({ ...recruitmentForm, requirements: e.target.value })}
                  placeholder="Requirements for this role..."
                  rows={3}
                  required
                />
              </div>
              <div className="form-group">
                <label>Google Form Link (Application Form)</label>
                <input
                  type="url"
                  value={recruitmentForm.googleFormLink}
                  onChange={(e) => setRecruitmentForm({ ...recruitmentForm, googleFormLink: e.target.value })}
                  placeholder="https://forms.gle/..."
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Deadline</label>
                  <input
                    type="date"
                    value={recruitmentForm.recruitmentDeadline}
                    onChange={(e) => setRecruitmentForm({ ...recruitmentForm, recruitmentDeadline: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={recruitmentForm.isRecruiting}
                    onChange={(e) => setRecruitmentForm({ ...recruitmentForm, isRecruiting: e.target.value === 'true' })}
                  >
                    <option value="true">Recruiting</option>
                    <option value="false">Closed</option>
                  </select>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowRecruitmentModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {selectedItem ? 'Update' : 'Post'} Recruitment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Event Modal */}
      {showEventModal && (
        <div className="modal-overlay" onClick={() => setShowEventModal(false)}>
          <div className={`admin-modal large-modal light-modal`} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><FaCalendarAlt /> {selectedItem ? 'Edit Event' : 'Post Event'}</h2>
              <button className="modal-close" onClick={() => setShowEventModal(false)}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleEventSubmit}>
              <div className="form-group">
                <label>Event Name</label>
                <input
                  type="text"
                  value={eventForm.name}
                  onChange={(e) => setEventForm({ ...eventForm, name: e.target.value })}
                  placeholder="Event name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Problem Statement</label>
                <textarea
                  value={eventForm.problemStatement}
                  onChange={(e) => setEventForm({ ...eventForm, problemStatement: e.target.value })}
                  placeholder="Problem statement for participants..."
                  rows={3}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  placeholder="Event description..."
                  rows={3}
                  required
                />
              </div>
              <div className="form-row three-col">
                <div className="form-group">
                  <label>Event Date</label>
                  <input
                    type="date"
                    value={eventForm.eventDate}
                    onChange={(e) => setEventForm({ ...eventForm, eventDate: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Registration Deadline</label>
                  <input
                    type="date"
                    value={eventForm.registrationDeadline}
                    onChange={(e) => setEventForm({ ...eventForm, registrationDeadline: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Submission Deadline</label>
                  <input
                    type="date"
                    value={eventForm.submissionDeadline}
                    onChange={(e) => setEventForm({ ...eventForm, submissionDeadline: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Prizes</label>
                <input
                  type="text"
                  value={eventForm.prizes}
                  onChange={(e) => setEventForm({ ...eventForm, prizes: e.target.value })}
                  placeholder="1st: ₹25,000, 2nd: ₹15,000..."
                />
              </div>
              <div className="form-group">
                <label>Rules</label>
                <textarea
                  value={eventForm.rules}
                  onChange={(e) => setEventForm({ ...eventForm, rules: e.target.value })}
                  placeholder="Event rules and guidelines..."
                  rows={2}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Registration Form Link</label>
                  <input
                    type="url"
                    value={eventForm.registrationFormLink}
                    onChange={(e) => setEventForm({ ...eventForm, registrationFormLink: e.target.value })}
                    placeholder="https://forms.gle/... (for registration)"
                  />
                </div>
                <div className="form-group">
                  <label>Submission Form Link</label>
                  <input
                    type="url"
                    value={eventForm.submissionFormLink}
                    onChange={(e) => setEventForm({ ...eventForm, submissionFormLink: e.target.value })}
                    placeholder="https://forms.gle/... (for submission)"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={eventForm.isActive}
                  onChange={(e) => setEventForm({ ...eventForm, isActive: e.target.value === 'true' })}
                >
                  <option value="true">Active</option>
                  <option value="false">Ended</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEventModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {selectedItem ? 'Update' : 'Post'} Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Responses Modal */}
      {showResponsesModal && selectedItem && (
        <div className="modal-overlay" onClick={() => setShowResponsesModal(false)}>
          <div className={`admin-modal large-modal light-modal`} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><FaClipboardList /> Responses for {selectedItem.name}</h2>
              <button className="modal-close" onClick={() => setShowResponsesModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="responses-header">
                <span className="responses-count">{getFilteredApplications().length} responses</span>
                <div className="export-buttons">
                  <button 
                    className="btn btn-export excel"
                    onClick={() => exportToExcel(getFilteredApplications(), selectedItem.name?.replace(/\s+/g, '_'))}
                    disabled={getFilteredApplications().length === 0}
                  >
                    <FaFileExcel /> Export Excel
                  </button>
                  <button 
                    className="btn btn-export sheets"
                    onClick={() => exportToGoogleSheets(getFilteredApplications(), selectedItem.name?.replace(/\s+/g, '_'))}
                    disabled={getFilteredApplications().length === 0}
                  >
                    <FaGoogle /> Export to Sheets
                  </button>
                </div>
              </div>
              {getFilteredApplications().length === 0 ? (
                <div className="empty-state">
                  <p>No responses yet</p>
                </div>
              ) : (
                <div className="responses-table-container">
                  <table className="responses-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>WhatsApp</th>
                        <th>Branch</th>
                        <th>Year</th>
                        <th>Enrollment No</th>
                        <th>Message</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getFilteredApplications().map(app => (
                        <tr key={app._id}>
                          <td>{app.studentName}</td>
                          <td>{app.email}</td>
                          <td>{app.whatsappNo || app.phone || '-'}</td>
                          <td>{app.branch}</td>
                          <td>{app.year}</td>
                          <td>{app.enrollmentNo || app.rollNumber || '-'}</td>
                          <td>{app.message || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowResponsesModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submissions Modal */}
      {showSubmissionsModal && selectedItem && (
        <div className="modal-overlay" onClick={() => setShowSubmissionsModal(false)}>
          <div className={`admin-modal large-modal light-modal`} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><FaClipboardList /> Submissions for {selectedItem.name}</h2>
              <button className="modal-close" onClick={() => setShowSubmissionsModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="responses-header">
                <span className="responses-count">{submissions.length} submissions</span>
                <div className="export-buttons">
                  <button 
                    className="btn btn-export excel"
                    onClick={() => exportSubmissionsToExcel(submissions, selectedItem.name?.replace(/\s+/g, '_'))}
                    disabled={submissions.length === 0}
                  >
                    <FaFileExcel /> Export Excel
                  </button>
                  <button 
                    className="btn btn-export sheets"
                    onClick={() => exportSubmissionsToGoogleSheets(submissions, selectedItem.name?.replace(/\s+/g, '_'))}
                    disabled={submissions.length === 0}
                  >
                    <FaGoogle /> Export to Sheets
                  </button>
                </div>
              </div>
              {submissions.length === 0 ? (
                <div className="empty-state">
                  <p>No submissions yet</p>
                </div>
              ) : (
                <div className="responses-table-container">
                  <table className="responses-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Enrollment No</th>
                        <th>Year</th>
                        <th>Branch</th>
                        <th>Drive Link</th>
                        <th>Submitted Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {submissions.map(sub => (
                        <tr key={sub._id}>
                          <td>{sub.studentName}</td>
                          <td>{sub.email}</td>
                          <td>{sub.enrollmentNo}</td>
                          <td>{sub.year}</td>
                          <td>{sub.branch}</td>
                          <td>
                            <a href={sub.driveLink} target="_blank" rel="noopener noreferrer" className="drive-link">
                              View Link
                            </a>
                          </td>
                          <td>{formatDate(sub.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowSubmissionsModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClubAdmin;
