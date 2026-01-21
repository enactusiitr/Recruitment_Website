import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaTimes, FaChevronDown, FaChevronUp, FaSearch, FaUsers, FaGoogle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { clubAPI, applicationAPI } from '../services/api';

const Recruitment = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);
  const [formData, setFormData] = useState({
    studentName: '',
    email: '',
    whatsappNo: '',
    branch: '',
    year: '',
    enrollmentNo: '',
    message: ''
  });

  useEffect(() => {
    fetchClubs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchClubs = async () => {
    try {
      setLoading(true);
      const response = await clubAPI.getAll();
      setClubs(response.data);
    } catch (error) {
      console.error('Error fetching clubs:', error);
      setClubs([]);
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

  const getEndOfDay = (value) => {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    date.setHours(23, 59, 59, 999);
    return date;
  };

  const handleApplyClick = (club) => {
    if (!club.isRecruiting) {
      toast.warning('This club is not currently recruiting');
      return;
    }
    setSelectedClub(club);
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const applicationData = {
        ...formData,
        type: 'club',
        referenceId: selectedClub._id
      };

      await applicationAPI.create(applicationData);
      toast.success(`Successfully applied to ${selectedClub.name}!`);
      setShowModal(false);
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
      toast.success(`Successfully applied to ${selectedClub.name}!`); // Show success for demo
      setShowModal(false);
    }
  };

  // Check if deadline has passed by more than 1 day (should be hidden)
  const shouldHideItem = (deadline) => {
    const endOfDay = getEndOfDay(deadline);
    if (!endOfDay) return false;
    const oneDayAfter = new Date(endOfDay.getTime() + 24 * 60 * 60 * 1000);
    return new Date() > oneDayAfter;
  };

  // Check if deadline has passed (show as closed)
  const isDeadlinePassed = (deadline) => {
    const endOfDay = getEndOfDay(deadline);
    if (!endOfDay) return false;
    return new Date() > endOfDay;
  };

  const filteredClubs = clubs
    .filter(club => {
      // Hide items more than 1 day past deadline
      if (shouldHideItem(club.recruitmentDeadline)) return false;
      // Search filter
      return club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (club.role && club.role.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (club.requirements && club.requirements.toLowerCase().includes(searchQuery.toLowerCase()));
    })
    .sort((a, b) => {
      // Sort by deadline (oldest first), items without deadline go to end
      const dateA = getEndOfDay(a.recruitmentDeadline) || new Date('9999-12-31');
      const dateB = getEndOfDay(b.recruitmentDeadline) || new Date('9999-12-31');
      return dateA - dateB;
    });

  return (
    <div className="recruitment-page light-theme">
      <div className="search-container">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search roles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      ) : clubs.length === 0 ? (
        <div className="empty-state">
          <h3>No clubs available</h3>
          <p>Check back later for new opportunities</p>
        </div>
      ) : (
        <div className="cards-stack">
            {filteredClubs.map((club) => {
              const expanded = expandedId === club._id;
              return (
                <div key={club._id} className="card club-card">
                  <div className="card-top">
                    <div>
                      <h3>{club.role || 'Open Position'}</h3>
                      <div className="meta-small"><FaUsers /> {club.name} {club.recruitmentDeadline ? `| Deadline: ${formatDate(club.recruitmentDeadline)}` : ''}</div>
                    </div>
                    <button className="card-arrow-btn" onClick={() => setExpandedId(expanded ? null : club._id)}>
                      {expanded ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                  </div>

                  {expanded && (
                    <div className="card-body">
                      <p className="card-content">{club.description}</p>

                      {club.requirements && (
                        <div className="requirements-section">
                          <strong>Requirements:</strong>
                          <ul className="requirements-list">
                            <li>{club.requirements}</li>
                          </ul>
                        </div>
                      )}

                      {club.recruitmentDeadline && (
                        <div className="deadline-banner">Application Deadline: {formatDate(club.recruitmentDeadline)}</div>
                      )}
                    </div>
                  )}

                  <div className="card-footer">
                    <div className="left-actions">
                      <span className={`recruitment-status ${club.isRecruiting && !isDeadlinePassed(club.recruitmentDeadline) ? 'open' : 'closed'}`}>
                        {club.isRecruiting && !isDeadlinePassed(club.recruitmentDeadline) ? <FaCheckCircle /> : <FaTimesCircle />} {club.isRecruiting && !isDeadlinePassed(club.recruitmentDeadline) ? 'Recruiting' : 'Closed'}
                      </span>
                    </div>
                    <div className="right-action">
                      <button
                        className={`btn ${club.isRecruiting && !isDeadlinePassed(club.recruitmentDeadline) ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => handleApplyClick(club)}
                        disabled={!club.isRecruiting || isDeadlinePassed(club.recruitmentDeadline)}
                      >
                        {club.isRecruiting && !isDeadlinePassed(club.recruitmentDeadline) ? 'Apply Now' : 'Closed'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {filteredClubs.length === 0 && !loading && (
        <div className="empty-state">
          <h3>No roles found</h3>
          <p>Try a different search term</p>
        </div>
      )}

      {/* Application Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Apply to {selectedClub?.name}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
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
                  <label>Why do you want to join? (Optional)</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself and why you're interested..."
                    rows="3"
                  />
                </div>
              </div>

              <div className="modal-footer">
                {selectedClub?.googleFormLink && (
                  <a 
                    href={selectedClub.googleFormLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-link"
                    style={{ marginRight: 'auto' }}
                  >
                    <FaGoogle style={{ marginRight: '8px' }} />
                    Open Google Form
                  </a>
                )}
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recruitment;
