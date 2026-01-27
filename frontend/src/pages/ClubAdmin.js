import React, { useState, useEffect } from 'react';
import { 
  FaBullhorn, FaUsers, FaCalendarAlt, FaPlus, FaTimes, FaEye, FaEdit, FaTrash,
  FaClipboardList, FaClock, FaExternalLinkAlt
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { noticeAPI, clubAPI, eventAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ClubAdmin = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('notices');
  const [loading, setLoading] = useState(false);
  
  // Data states
  const [notices, setNotices] = useState([]);
  const [recruitments, setRecruitments] = useState([]);
  const [events, setEvents] = useState([]);
  
  // Modal states
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [showRecruitmentModal, setShowRecruitmentModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  
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
    isRecruiting: true,
    responseLink: ''
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
    registrationResponseLink: '',
    submissionResponseLink: '',
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
        isRecruiting: recruitmentForm.isRecruiting !== false,  // Use form value
        responseLink: recruitmentForm.responseLink || ''
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
        submissionFormLink: eventForm.submissionFormLink || '',
        registrationResponseLink: eventForm.registrationResponseLink || '',
        submissionResponseLink: eventForm.submissionResponseLink || ''
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
  const viewResponses = (item, type) => {
    // Open admin-provided response sheet link instead of showing modal
    try {
      if (type === 'club') {
        if (item.responseLink) {
          window.open(item.responseLink, '_blank', 'noopener,noreferrer');
          return;
        }
        if (item.googleFormLink) {
          window.open(item.googleFormLink, '_blank', 'noopener,noreferrer');
          return;
        }
      } else if (type === 'event') {
        if (item.registrationResponseLink) {
          window.open(item.registrationResponseLink, '_blank', 'noopener,noreferrer');
          return;
        }
        if (item.registrationFormLink) {
          window.open(item.registrationFormLink, '_blank', 'noopener,noreferrer');
          return;
        }
      }
      toast.info('No response sheet or form link provided for this item');
    } catch (error) {
      console.error('Error opening response link:', error);
      toast.error('Failed to open response link');
    }
  };

  const viewSubmissions = (event) => {
    // Open admin-provided submission response sheet link instead of showing modal
    try {
      if (event.submissionResponseLink) {
        window.open(event.submissionResponseLink, '_blank', 'noopener,noreferrer');
        return;
      }
      if (event.submissionFormLink) {
        window.open(event.submissionFormLink, '_blank', 'noopener,noreferrer');
        return;
      }
      toast.info('No submission response sheet or form link provided for this event');
    } catch (error) {
      console.error('Error opening submission response link:', error);
      toast.error('Failed to open submission response link');
    }
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
      isRecruiting: true,
      responseLink: ''
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
      registrationResponseLink: '',
      submissionResponseLink: '',
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
      isRecruiting: recruitment.isRecruiting,
      responseLink: recruitment.responseLink || ''
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
      registrationResponseLink: event.registrationResponseLink || '',
      submissionResponseLink: event.submissionResponseLink || '',
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
                            <span className="date-info"><FaClock /> Deadline: {formatDate(rec.recruitmentDeadline)}</span>
                            {rec.googleFormLink && (
                              <div className="link-info">
                                <FaExternalLinkAlt /> Form: <a href={rec.googleFormLink} target="_blank" rel="noopener noreferrer">{rec.googleFormLink}</a>
                              </div>
                            )}
                            {rec.responseLink && (
                              <div className="link-info">
                                <FaExternalLinkAlt /> Responses: <a href={rec.responseLink} target="_blank" rel="noopener noreferrer">{rec.responseLink}</a>
                              </div>
                            )}
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
                            <span className="date-info"><FaCalendarAlt /> Event: {formatDate(event.eventDate)}</span>
                            {event.registrationFormLink && (
                              <div className="link-info">
                                <FaExternalLinkAlt /> Registration Form: <a href={event.registrationFormLink} target="_blank" rel="noopener noreferrer">{event.registrationFormLink}</a>
                              </div>
                            )}
                            {event.registrationResponseLink && (
                              <div className="link-info">
                                <FaExternalLinkAlt /> Registration Responses: <a href={event.registrationResponseLink} target="_blank" rel="noopener noreferrer">{event.registrationResponseLink}</a>
                              </div>
                            )}
                            {event.submissionFormLink && (
                              <div className="link-info">
                                <FaExternalLinkAlt /> Submission Form: <a href={event.submissionFormLink} target="_blank" rel="noopener noreferrer">{event.submissionFormLink}</a>
                              </div>
                            )}
                            {event.submissionResponseLink && (
                              <div className="link-info">
                                <FaExternalLinkAlt /> Submission Responses: <a href={event.submissionResponseLink} target="_blank" rel="noopener noreferrer">{event.submissionResponseLink}</a>
                              </div>
                            )}
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
              <div className="form-group">
                <label>Response Link (Google Sheets for responses)</label>
                <input
                  type="url"
                  value={recruitmentForm.responseLink}
                  onChange={(e) => setRecruitmentForm({ ...recruitmentForm, responseLink: e.target.value })}
                  placeholder="https://docs.google.com/spreadsheets/... (response sheet)"
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
              <div className="form-row">
                <div className="form-group">
                  <label>Registration Response Link</label>
                  <input
                    type="url"
                    value={eventForm.registrationResponseLink}
                    onChange={(e) => setEventForm({ ...eventForm, registrationResponseLink: e.target.value })}
                    placeholder="https://docs.google.com/spreadsheets/... (registration responses)"
                  />
                </div>
                <div className="form-group">
                  <label>Submission Response Link</label>
                  <input
                    type="url"
                    value={eventForm.submissionResponseLink}
                    onChange={(e) => setEventForm({ ...eventForm, submissionResponseLink: e.target.value })}
                    placeholder="https://docs.google.com/spreadsheets/... (submission responses)"
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

      {/* Responses and Submissions are now opened via external response sheet links */}
    </div>
  );
};

export default ClubAdmin;
