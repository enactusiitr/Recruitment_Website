import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaClock, FaBuilding, FaTrophy, FaExternalLinkAlt, FaChevronDown, FaChevronUp, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { eventAPI } from '../services/api';

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

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  const getEndOfDay = (value) => {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    date.setHours(23, 59, 59, 999);
    return date;
  };

  const isDeadlinePassed = (deadline) => {
    const endOfDay = getEndOfDay(deadline);
    if (!endOfDay) return false;
    return new Date() > endOfDay;
  };

  // Check if event should be hidden (more than 1 day past latest deadline)
  const shouldHideEvent = (event) => {
    const latestDeadline = event.submissionDeadline || event.registrationDeadline || event.eventDate;
    const endOfDay = getEndOfDay(latestDeadline);
    if (!endOfDay) return false;
    const oneDayAfter = new Date(endOfDay.getTime() + 24 * 60 * 60 * 1000);
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
    // Redirect to admin-provided registration form link if available
    if (event.registrationFormLink) {
      window.open(event.registrationFormLink, '_blank', 'noopener,noreferrer');
      return;
    }
    toast.info('No external registration form provided for this event');
  };

  const handleSubmitClick = (event) => {
    if (isDeadlinePassed(event.submissionDeadline)) {
      toast.warning('Submission deadline has passed');
      return;
    }
    // Redirect to admin-provided submission form link if available
    if (event.submissionFormLink) {
      window.open(event.submissionFormLink, '_blank', 'noopener,noreferrer');
      return;
    }
    toast.info('No external submission form provided for this event');
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
                      {renderContentWithLinksAndBullets(event.problemStatement)}
                    </div>

                    <div className="card-content">{renderContentWithLinksAndBullets(event.description)}</div>

                    {event.prizes && (
                      <div className="prizes-section">
                        <FaTrophy className="prize-icon" />
                        <span>{event.prizes}</span>
                      </div>
                    )}

                    {event.rules && (
                      <div className="rules-section">
                        <strong>Rules:</strong>
                        {renderContentWithLinksAndBullets(event.rules)}
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

      {/* External registration flow: users are redirected to admin-provided registration form links. */}

      {/* External submission flow: users are redirected to admin-provided submission form links. */}
    </div>
  );
};

export default Events;
