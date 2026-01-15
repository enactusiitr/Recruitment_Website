import React, { useState, useEffect } from 'react';
import { FaUserPlus, FaEdit, FaTrash, FaKey, FaEye, FaEyeSlash, FaUserShield, FaTimes, FaCheck, FaBan } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const SuperAdmin = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    club: ''
  });
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'superadmin') {
      navigate('/login');
      return;
    }
    fetchAdmins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user]);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getAll();
      setAdmins(response.data.filter(u => u.role === 'clubadmin'));
    } catch (error) {
      console.error('Error fetching admins:', error);
      toast.error('Failed to load admins');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    if (!formData.club) {
      toast.error('Please enter a club name');
      return;
    }
    try {
      await userAPI.create({
        ...formData,
        role: 'clubadmin'
      });
      toast.success('Club admin created successfully!');
      setShowAddModal(false);
      setFormData({ name: '', email: '', password: '', club: '' });
      fetchAdmins();
    } catch (error) {
      console.error('Error creating admin:', error);
      toast.error(error.response?.data?.message || 'Failed to create admin');
    }
  };

  const handleEditAdmin = async (e) => {
    e.preventDefault();
    try {
      await userAPI.update(selectedAdmin._id, {
        name: formData.name,
        email: formData.email,
        club: formData.club,
        isActive: selectedAdmin.isActive
      });
      toast.success('Admin updated successfully!');
      setShowEditModal(false);
      fetchAdmins();
    } catch (error) {
      console.error('Error updating admin:', error);
      toast.error('Failed to update admin');
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    try {
      await userAPI.updatePassword(selectedAdmin._id, newPassword);
      toast.success('Password updated successfully!');
      setShowPasswordModal(false);
      setNewPassword('');
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('Failed to update password');
    }
  };

  const handleToggleActive = async (admin) => {
    try {
      await userAPI.update(admin._id, {
        ...admin,
        isActive: !admin.isActive
      });
      toast.success(`Admin ${admin.isActive ? 'deactivated' : 'activated'} successfully!`);
      fetchAdmins();
    } catch (error) {
      console.error('Error toggling admin status:', error);
      toast.error('Failed to update admin status');
    }
  };

  const handleDeleteAdmin = async (admin) => {
    if (!window.confirm(`Are you sure you want to delete ${admin.name}? This action cannot be undone.`)) {
      return;
    }
    try {
      await userAPI.delete(admin._id);
      toast.success('Admin deleted successfully!');
      fetchAdmins();
    } catch (error) {
      console.error('Error deleting admin:', error);
      toast.error('Failed to delete admin');
    }
  };

  const openEditModal = (admin) => {
    setSelectedAdmin(admin);
    setFormData({
      name: admin.name,
      email: admin.email,
      password: '',
      club: admin.club
    });
    setShowEditModal(true);
  };

  const openPasswordModal = (admin) => {
    setSelectedAdmin(admin);
    setNewPassword('');
    setShowPasswordModal(true);
  };

  if (!isAuthenticated || user?.role !== 'superadmin') {
    return null;
  }

  return (
    <div className="admin-page light-theme">
      <div className="admin-container">
        <div className="admin-header">
          <div className="header-left">
            <FaUserShield className="header-icon" />
            <div>
              <h1>Super Admin Panel</h1>
              <p>Manage clubs and administrators</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        {/* <div className="admin-tabs">
          <button 
            className={`tab-btn ${activeTab === 'admins' ? 'active' : ''}`}
            onClick={() => setActiveTab('admins')}
          >
            <FaUserShield /> Club Admins
          </button>
        </div> */}

        {/* Club Admins Tab */}
        <>
          <div className="section-header" style={{ justifyContent: 'flex-end' }}>
            <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
              <FaUserPlus /> Add New Admin
            </button>
          </div>

            {loading ? (
              <div className="loading">
                <div className="spinner"></div>
              </div>
            ) : admins.length === 0 ? (
              <div className="empty-state">
                <FaUserShield className="empty-icon" />
                <h3>No Club Admins</h3>
                <p>Add your first club administrator to get started</p>
              </div>
            ) : (
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Club</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admins.map((admin) => (
                      <tr key={admin._id} className={!admin.isActive ? 'inactive-row' : ''}>
                        <td>{admin.name}</td>
                        <td>{admin.email}</td>
                        <td>
                          <span className="club-badge">{admin.club}</span>
                        </td>
                        <td>
                          <span className={`status-badge ${admin.isActive ? 'active' : 'inactive'}`}>
                            {admin.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>{new Date(admin.createdAt).toLocaleDateString()}</td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="action-btn edit-btn" 
                              onClick={() => openEditModal(admin)}
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button 
                              className="action-btn password-btn" 
                              onClick={() => openPasswordModal(admin)}
                              title="Change Password"
                            >
                              <FaKey />
                            </button>
                            <button 
                              className={`action-btn ${admin.isActive ? 'deactivate-btn' : 'activate-btn'}`}
                              onClick={() => handleToggleActive(admin)}
                              title={admin.isActive ? 'Deactivate' : 'Activate'}
                            >
                              {admin.isActive ? <FaBan /> : <FaCheck />}
                            </button>
                            <button 
                              className="action-btn delete-btn" 
                              onClick={() => handleDeleteAdmin(admin)}
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
      </div>

      {/* Add Admin Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="admin-modal light-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><FaUserPlus /> Add New Club Admin</h2>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleAddAdmin}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="admin@example.com"
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <div className="password-input-group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Minimum 6 characters"
                    minLength={6}
                    required
                  />
                  <button 
                    type="button" 
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label>Club Name</label>
                <input
                  type="text"
                  name="club"
                  value={formData.club}
                  onChange={handleInputChange}
                  placeholder="Enter club name (e.g., ACM, E-Cell, Enactus)"
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Admin Modal */}
      {showEditModal && selectedAdmin && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="admin-modal light-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><FaEdit /> Edit Admin</h2>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleEditAdmin}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="admin@example.com"
                  required
                />
              </div>
              <div className="form-group">
                <label>Club Name</label>
                <input
                  type="text"
                  name="club"
                  value={formData.club}
                  onChange={handleInputChange}
                  placeholder="Enter club name (e.g., ACM, E-Cell, Enactus)"
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && selectedAdmin && (
        <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="admin-modal light-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><FaKey /> Change Password</h2>
              <button className="modal-close" onClick={() => setShowPasswordModal(false)}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleUpdatePassword}>
              <div className="password-info">
                <p>Changing password for: <strong>{selectedAdmin.name}</strong></p>
                <p className="email-info">{selectedAdmin.email}</p>
              </div>
              <div className="form-group">
                <label>New Password</label>
                <div className="password-input-group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    minLength={6}
                    required
                  />
                  <button 
                    type="button" 
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowPasswordModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdmin;
