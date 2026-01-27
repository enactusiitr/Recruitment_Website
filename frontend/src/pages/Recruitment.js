import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaChevronDown, FaChevronUp, FaSearch, FaUsers } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { clubAPI } from '../services/api';

// Utility function to render content with URLs as hyperlinks and line breaks as bullets
const renderContentWithLinksAndBullets = (content) => {
  if (!content) return null;
  
  // Split by line breaks
  const paragraphs = content.split(/\n+/).filter(p => p.trim());
  
  // URL regex pattern
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  
  const processText = (text) => {
    const parts = text.split(urlRegex);
    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="inline-link">
            {part}
          </a>
        );
      }
      return part;
    });
  };
  
  if (paragraphs.length === 1) {
    return <p>{processText(paragraphs[0])}</p>;
  }
  
  return (
    <ul className="content-bullets">
      {paragraphs.map((paragraph, index) => (
        <li key={index}>{processText(paragraph)}</li>
      ))}
    </ul>
  );
};

const Recruitment = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

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
    // Redirect to admin-provided form link if available
    if (club.googleFormLink) {
      window.open(club.googleFormLink, '_blank', 'noopener,noreferrer');
      return;
    }
    toast.info('No external application form provided for this recruitment');
  };

  // No in-site application submission anymore; users are redirected to external form links.

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
                      <div className="card-content">{renderContentWithLinksAndBullets(club.description)}</div>

                      {club.requirements && (
                        <div className="requirements-section">
                          <strong>Requirements:</strong>
                          {renderContentWithLinksAndBullets(club.requirements)}
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
      {/* External application flow: users are redirected to admin-provided form links. */}
    </div>
  );
};

export default Recruitment;
