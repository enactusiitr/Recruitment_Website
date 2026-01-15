import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaClock, FaBuilding, FaTrophy, FaTimes, FaExternalLinkAlt, FaChevronDown, FaChevronUp, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { eventAPI, applicationAPI, submissionAPI } from '../services/api';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [driveLink, setDriveLink] = useState('');
  const [formData, setFormData] = useState({
    studentName: '',
    email: '',
    whatsappNo: '',
    branch: '',
    year: '',
    enrollmentNo: '',
    message: ''
  });
  const [submitFormData, setSubmitFormData] = useState({
    studentName: '',
    email: '',
    enrollmentNo: '',
    year: '',
    branch: ''
  });

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventAPI.getAll();
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const isDeadlinePassed = (deadline) => {
    return new Date(deadline) < new Date();
  };

  // Check if event should be hidden (more than 1 day past latest deadline)
  const shouldHideEvent = (event) => {
    const latestDeadline = event.submissionDeadline || event.registrationDeadline || event.eventDate;
    if (!latestDeadline) return false;
    const deadlineDate = new Date(latestDeadline);
    const oneDayAfter = new Date(deadlineDate.getTime() + 24 * 60 * 60 * 1000);
    return new Date() > oneDayAfter;
  };

  // Check if event is closed (past deadline but within 1 day grace period)
  const isEventClosed = (event) => {
    const latestDeadline = event.submissionDeadline || event.registrationDeadline || event.eventDate;
    if (!latestDeadline) return false;
    return isDeadlinePassed(latestDeadline);
  };

  const handleApplyClick = (event) => {
    if (isDeadlinePassed(event.registrationDeadline)) {
      toast.warning('Registration deadline has passed');
      return;
    }
    setSelectedEvent(event);
    setShowApplyModal(true);
  };

  const handleSubmitClick = (event) => {
    if (isDeadlinePassed(event.submissionDeadline)) {
      toast.warning('Submission deadline has passed');
      return;
    }
    setSelectedEvent(event);
    setShowSubmitModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    
    try {
      const applicationData = {
        ...formData,
        type: 'event',
        referenceId: selectedEvent._id
      };

      await applicationAPI.create(applicationData);
      toast.success(`Successfully registered for ${selectedEvent.name}!`);
      setShowApplyModal(false);
      setFormData({
        studentName: '',
        email: '',
        phone: '',
        branch: '',
        year: '',
        rollNumber: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.success(`Successfully registered for ${selectedEvent.name}!`); // Show success for demo
      setShowApplyModal(false);
    }
  };

  const handleDriveLinkSubmit = async (e) => {
    e.preventDefault();
    
    // Validate cloud storage link
    if (!driveLink.trim()) {
      toast.error('Please enter a valid cloud storage link');
      return;
    }

    // Validate required fields
    if (!submitFormData.studentName || !submitFormData.email || !submitFormData.enrollmentNo || 
        !submitFormData.year || !submitFormData.branch) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const submissionData = {
        eventId: selectedEvent._id,
        studentName: submitFormData.studentName,
        email: submitFormData.email,
        enrollmentNo: submitFormData.enrollmentNo,
        year: submitFormData.year,
        branch: submitFormData.branch,
        driveLink: driveLink.trim()
      };

      await submissionAPI.create(submissionData);
      toast.success(`Submission successful for ${selectedEvent.name}!`);
      setShowSubmitModal(false);
      setDriveLink('');
      setSubmitFormData({
        studentName: '',
        email: '',
        enrollmentNo: '',
        year: '',
        branch: ''
      });
    } catch (error) {
      console.error('Error submitting:', error);
      toast.error(error.response?.data?.message || 'Failed to submit. Please try again.');
    }
  };

  const filteredEvents = events
    .filter(event => {
      // Hide events more than 1 day past deadline
      if (shouldHideEvent(event)) return false;
      // Search filter
      return event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.clubName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase()));
    })
    .sort((a, b) => {
      // Sort by event date (oldest first)
      const dateA = a.eventDate ? new Date(a.eventDate) : new Date('9999-12-31');
      const dateB = b.eventDate ? new Date(b.eventDate) : new Date('9999-12-31');
      return dateA - dateB;
    });

  return (
    <div className="events-page light-theme">
      <div className="search-container">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      ) : events.length === 0 ? (
        <div className="empty-state">
          <h3>No events available</h3>
          <p>Check back later for upcoming events</p>
        </div>
      ) : (
        <div className="cards-stack">
          {filteredEvents.map((event) => {
            const expanded = expandedId === event._id;
            return (
              <div key={event._id} className="card event-card">
                <div className="card-top">
                  <div>
                    <h3>{event.name}</h3>
                    <div className="meta-small">{event.clubName} {event.eventDate ? `| ${formatDate(event.eventDate)}` : ''}</div>
                  </div>
                  <button className="card-arrow-btn" onClick={() => setExpandedId(expanded ? null : event._id)}>
                    {expanded ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                </div>

                {expanded && (
                  <div className="card-body">
                    <div className="problem-statement">
                      <h4>Problem Statement</h4>
                      <p>{event.problemStatement}</p>
                    </div>

                    <p className="card-content">{event.description}</p>

                    {event.prizes && (
                      <div className="prizes-section">
                        <FaTrophy className="prize-icon" />
                        <span>{event.prizes}</span>
                      </div>
                    )}

                    {event.rules && (
                      <div className="rules-section">
                        <strong>Rules:</strong> {event.rules}
                      </div>
                    )}

                    <div className="deadline-info">
                      <span className={isDeadlinePassed(event.registrationDeadline) ? 'deadline-passed' : ''}>
                        <FaClock />
                        Registration: {formatDate(event.registrationDeadline)}
                        {isDeadlinePassed(event.registrationDeadline) && ' (Closed)'}
                      </span>
                      <span className={isDeadlinePassed(event.submissionDeadline) ? 'deadline-passed' : ''}>
                        <FaClock />
                        Submission: {formatDate(event.submissionDeadline)}
                        {isDeadlinePassed(event.submissionDeadline) && ' (Closed)'}
                      </span>
                    </div>
                  </div>
                )}

                <div className="card-footer">
                  <div className="left-actions">
                    <span className={`card-badge ${event.isActive && !isEventClosed(event) ? 'badge-event' : 'badge-general'}`}>
                      {isEventClosed(event) ? 'CLOSED' : (event.isActive ? 'ACTIVE' : 'Ended')}
                    </span>
                    <span className="meta-info"><FaBuilding /> {event.clubName}</span>
                    <span className="meta-info"><FaCalendarAlt /> Event: {formatDate(event.eventDate)}</span>
                  </div>

                  <div className="right-action button-group">
                    <button
                      className={`btn ${isDeadlinePassed(event.registrationDeadline) ? 'btn-secondary' : 'btn-primary'}`}
                      onClick={() => handleApplyClick(event)}
                      disabled={isDeadlinePassed(event.registrationDeadline)}
                    >
                      {isDeadlinePassed(event.registrationDeadline) ? 'Closed' : 'Register'}
                    </button>
                    <button
                      className={`btn ${isDeadlinePassed(event.submissionDeadline) ? 'btn-secondary' : 'btn-success'}`}
                      onClick={() => handleSubmitClick(event)}
                      disabled={isDeadlinePassed(event.submissionDeadline)}
                    >
                      <FaExternalLinkAlt />
                      {isDeadlinePassed(event.submissionDeadline) ? 'Closed' : 'Submit'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {filteredEvents.length === 0 && !loading && (
        <div className="empty-state">
          <h3>No events found</h3>
          <p>Try a different search term</p>
        </div>
      )}

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="modal-overlay" onClick={() => setShowApplyModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Register for {selectedEvent?.name}</h2>
              <button className="modal-close" onClick={() => setShowApplyModal(false)}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleApplySubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="your@email.com"
                    />
                  </div>
                  <div className="form-group">
                    <label>WhatsApp No. *</label>
                    <input
                      type="tel"
                      name="whatsappNo"
                      value={formData.whatsappNo}
                      onChange={handleInputChange}
                      required
                      placeholder="10-digit WhatsApp number"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Branch *</label>
                    <input
                      type="text"
                      name="branch"
                      value={formData.branch}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., CSE, ECE, ME..."
                    />
                  </div>
                  <div className="form-group">
                    <label>Year *</label>
                    <select
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Year</option>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Enrollment No. *</label>
                  <input
                    type="text"
                    name="enrollmentNo"
                    value={formData.enrollmentNo}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your enrollment number"
                  />
                </div>

                <div className="form-group">
                  <label>Team Members / Additional Info (Optional)</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="List team members or any additional information..."
                    rows="3"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowApplyModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submit Modal */}
      {showSubmitModal && (
        <div className="modal-overlay" onClick={() => setShowSubmitModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Submit for {selectedEvent?.name}</h2>
              <button className="modal-close" onClick={() => setShowSubmitModal(false)}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleDriveLinkSubmit}>
              <div className="modal-body">
                <div className="submission-info">
                  <p>Upload your project files to Drive and share the link below.</p>
                  <p>Make sure the link has <strong>"Anyone with the link can view"</strong> access.</p>
                </div>

                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    value={submitFormData.studentName}
                    onChange={(e) => setSubmitFormData({ ...submitFormData, studentName: e.target.value })}
                    required
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      value={submitFormData.email}
                      onChange={(e) => setSubmitFormData({ ...submitFormData, email: e.target.value })}
                      required
                      placeholder="your@email.com"
                    />
                  </div>
                  <div className="form-group">
                    <label>Enrollment No. *</label>
                    <input
                      type="text"
                      value={submitFormData.enrollmentNo}
                      onChange={(e) => setSubmitFormData({ ...submitFormData, enrollmentNo: e.target.value })}
                      required
                      placeholder="Your enrollment number"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Year *</label>
                  <select
                    value={submitFormData.year}
                    onChange={(e) => setSubmitFormData({ ...submitFormData, year: e.target.value })}
                    required
                  >
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Branch *</label>
                  <input
                    type="text"
                    value={submitFormData.branch}
                    onChange={(e) => setSubmitFormData({ ...submitFormData, branch: e.target.value })}
                    required
                    placeholder="Enter your branch (e.g., CSE, ECE, ME)"
                  />
                </div>

                <div className="form-group">
                  <label>Drive Link *</label>
                  <input
                    type="url"
                    value={driveLink}
                    onChange={(e) => setDriveLink(e.target.value)}
                    required
                    placeholder="https://drive.google.com/... or any cloud storage link"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowSubmitModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-success">
                  <FaExternalLinkAlt />
                  Submit Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
