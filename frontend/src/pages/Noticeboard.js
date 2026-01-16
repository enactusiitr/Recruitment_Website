import React, { useState, useEffect } from 'react';
import { FaSearch, FaTimes, FaChevronDown, FaChevronUp, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { noticeAPI, clubAPI } from '../services/api';

const NOTICES_PER_PAGE = 6;

const Noticeboard = () => {
  const [notices, setNotices] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    club: '',
    category: '',
    search: ''
  });
  const [expandedFilters, setExpandedFilters] = useState({
    club: true,
    category: true
  });

  const categories = ['General', 'Event', 'Recruitment', 'Announcement'];

  useEffect(() => {
    fetchClubs();
  }, []);

  useEffect(() => {
    fetchNotices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchClubs = async () => {
    try {
      const response = await clubAPI.getAll({ showAll: true });
      setClubs(response.data.map(c => c.name));
    } catch (error) {
      console.error('Error fetching clubs:', error);
      setClubs([]);
    }
  };

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.category) params.category = filters.category;
      if (filters.club) params.clubName = filters.club;
      if (filters.search) params.search = filters.search;

      const response = await noticeAPI.getAll(params);
      setNotices(response.data);
    } catch (error) {
      console.error('Error fetching notices:', error);
      setNotices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ 
      ...prev, 
      [filterType]: prev[filterType] === value ? '' : value 
    }));
  };

  const toggleFilterSection = (section) => {
    setExpandedFilters(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const clearAllFilters = () => {
    setFilters({ club: '', category: '', search: '' });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.club) count++;
    if (filters.category) count++;
    return count;
  };

  const handleViewMore = (notice) => {
    setSelectedNotice(notice);
    setShowModal(true);
  };

  const truncateContent = (content, maxLength = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + '...';
  };

  const getCategoryColor = (category) => {
    const colors = {
      general: '#6b7280',
      event: '#3b82f6',
      recruitment: '#10b981',
      announcement: '#f59e0b'
    };
    return colors[category] || colors.general;
  };

  const filteredNotices = notices
    .filter(notice => {
      if (filters.club && notice.clubName !== filters.club) return false;
      if (filters.category && notice.category !== filters.category) return false;
      if (filters.search && !notice.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      // Sort by createdAt date (newest first)
      const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
      const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
      return dateB - dateA;
    });

  // Pagination calculations
  const totalPages = Math.ceil(filteredNotices.length / NOTICES_PER_PAGE);
  const startIndex = (currentPage - 1) * NOTICES_PER_PAGE;
  const paginatedNotices = filteredNotices.slice(startIndex, startIndex + NOTICES_PER_PAGE);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="noticeboard-page light-theme">
      <div className="noticeboard-layout">
        {/* Left Sidebar Filters */}
        <aside className="filters-sidebar">
          <div className="filters-header">
            <span className="filters-title">
              All Filters
              {getActiveFilterCount() > 0 && (
                <span className="filter-count">{getActiveFilterCount()}</span>
              )}
            </span>
            {getActiveFilterCount() > 0 && (
              <button className="clear-filters" onClick={clearAllFilters}>
                Clear All
              </button>
            )}
          </div>

          {/* Club Filter */}
          <div className="filter-section-sidebar">
            <div 
              className="filter-section-header"
              onClick={() => toggleFilterSection('club')}
            >
              <span>Clubs</span>
              <div className="filter-header-right">
                {filters.club && <span className="active-count">1</span>}
                {expandedFilters.club ? <FaChevronUp /> : <FaChevronDown />}
              </div>
            </div>
            {expandedFilters.club && (
              <div className="filter-options">
                {clubs.map(club => (
                  <label key={club} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={filters.club === club}
                      onChange={() => handleFilterChange('club', club)}
                    />
                    <span>{club}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Category Filter */}
          <div className="filter-section-sidebar">
            <div 
              className="filter-section-header"
              onClick={() => toggleFilterSection('category')}
            >
              <span>Category</span>
              <div className="filter-header-right">
                {filters.category && <span className="active-count">1</span>}
                {expandedFilters.category ? <FaChevronUp /> : <FaChevronDown />}
              </div>
            </div>
            {expandedFilters.category && (
              <div className="filter-options">
                {categories.map(cat => (
                  <label key={cat} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={filters.category === cat}
                      onChange={() => handleFilterChange('category', cat)}
                    />
                    <span className="capitalize">{cat}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="notices-main">
          <div className="notices-header">
            <span className="results-count">
              {filteredNotices.length} Results
            </span>
            <div className="search-sort-container">
              <div className="search-box">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search notices..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : filteredNotices.length === 0 ? (
            <div className="empty-state">
              <h3>No notices found</h3>
              <p>Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <div className="notices-list">
                {paginatedNotices.map((notice) => (
                  <div key={notice._id} className="notice-card-horizontal">
                    <div className="notice-content">
                      <div className="notice-header-row">
                        <div className="notice-title-section">
                          <span className="notice-category-badge" style={{ backgroundColor: getCategoryColor(notice.category) }}>
                            {notice.category}
                          </span>
                          <h3 className="notice-title">{notice.title}</h3>
                          <p className="notice-organizer">{notice.clubName}</p>
                        </div>
                        <div className="notice-logo" style={{ background: `linear-gradient(135deg, ${getCategoryColor(notice.category)} 0%, #764ba2 100%)` }}>
                          <span className="logo-placeholder">{notice.clubName.charAt(0)}</span>
                        </div>
                      </div>
                      
                      <p className="notice-preview">
                        {truncateContent(notice.content)}
                      </p>

                      <div className="notice-footer-row">
                        <div className="footer-left">
                          <span className="posted-date">
                            Posted {formatDate(notice.createdAt)}
                          </span>
                        </div>
                        <div className="footer-right">
                          <button 
                            className="btn-view-more"
                            onClick={() => handleViewMore(notice)}
                          >
                            View More
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button 
                    className="pagination-btn"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <FaChevronLeft />
                  </button>
                  
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      className={`pagination-btn ${currentPage === index + 1 ? 'active' : ''}`}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}
                  
                  <button 
                    className="pagination-btn"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <FaChevronRight />
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* View More Modal - Read Only */}
      {showModal && selectedNotice && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="notice-modal light-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-section">
                <span className="modal-category" style={{ backgroundColor: getCategoryColor(selectedNotice.category) }}>
                  {selectedNotice.category}
                </span>
                <h2>{selectedNotice.title}</h2>
              </div>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <FaTimes />
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-club-info">
                <div className="modal-club-logo" style={{ background: `linear-gradient(135deg, ${getCategoryColor(selectedNotice.category)} 0%, #764ba2 100%)` }}>
                  {selectedNotice.clubName.charAt(0)}
                </div>
                <div className="modal-club-details">
                  <span className="modal-club-name">{selectedNotice.clubName}</span>
                  <span className="modal-date">Posted on {formatDate(selectedNotice.createdAt)}</span>
                </div>
              </div>

              <div className="modal-content-section">
                <h4>Details</h4>
                <p>{selectedNotice.content}</p>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Noticeboard;
