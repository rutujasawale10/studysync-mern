import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import GroupCard from '../components/GroupCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import { Search, PlusCircle, Filter, BookOpen, Users, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const GroupDirectory = () => {
  const [groups, setGroups] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const { isAuthenticated } = useAuth();

  const fetchGroups = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (selectedSubject !== 'All') params.subject = selectedSubject;
      if (selectedStatus !== 'All') params.status = selectedStatus;

      const res = await api.get('/groups', { params });
      if (res.data.success) {
        setGroups(res.data.groups);
        if (res.data.availableSubjects && res.data.availableSubjects.length > 0) {
          setAvailableSubjects(res.data.availableSubjects);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load study groups. Please check server connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchGroups();
    }, 250);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, selectedSubject, selectedStatus]);

  const handleJoinSuccess = async (groupId) => {
    try {
      const res = await api.post(`/groups/${groupId}/join`);
      if (res.data.success) {
        setSuccessMessage(res.data.message || 'Successfully joined the study group!');
        // Refresh groups list
        fetchGroups();
        setTimeout(() => setSuccessMessage(''), 4000);
      }
    } catch (err) {
      setError(err.message || 'Failed to join group.');
      setTimeout(() => setError(''), 4000);
    }
  };

  const handleJoinError = (errorMessage) => {
    setError(errorMessage);
    setTimeout(() => setError(''), 4000);
  };

  const openGroupsCount = groups.filter(
    (g) => g.status === 'Open' && (g.members?.length || 0) < g.maxMembers
  ).length;

  return (
    <div>
      {/* Hero Banner */}
      <div className="hero-banner">
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h1 className="hero-title">Collaborate, Learn & Ace Exams Together</h1>
          <p className="hero-desc">
            Discover active campus study circles, find peer learning groups for your semester subjects, or launch your own group in seconds.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {isAuthenticated ? (
              <Link to="/create-group" className="btn btn-primary btn-lg">
                <PlusCircle size={20} />
                <span>Create Study Group</span>
              </Link>
            ) : (
              <Link to="/register" className="btn btn-primary btn-lg">
                <PlusCircle size={20} />
                <span>Join StudySync Today</span>
              </Link>
            )}
            <div style={{ display: 'flex', gap: '1.25rem', color: 'var(--gray-300)', fontSize: '0.9rem', fontWeight: 500 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Users size={16} color="var(--primary-400)" />
                <strong>{groups.length}</strong> Total Groups
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle size={16} color="var(--success-500)" />
                <strong>{openGroupsCount}</strong> Open for Joining
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Global Alerts */}
      {successMessage && (
        <Alert type="success" message={successMessage} onClose={() => setSuccessMessage('')} />
      )}
      {error && <Alert type="danger" message={error} onClose={() => setError('')} />}

      {/* Search & Filter Bar */}
      <div className="filter-bar">
        {/* Search Input */}
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search groups by topic, subject, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Subject Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={16} color="var(--gray-500)" />
          <select
            className="filter-select"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            aria-label="Filter by subject"
          >
            <option value="All">All Subjects</option>
            {availableSubjects.map((subj) => (
              <option key={subj} value={subj}>
                {subj}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <select
          className="filter-select"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          aria-label="Filter by status"
          style={{ minWidth: '130px' }}
        >
          <option value="All">All Statuses</option>
          <option value="Open">Open Only</option>
          <option value="Full">Full Only</option>
        </select>
      </div>

      {/* Group Directory Header */}
      <div className="page-header" style={{ marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Study Group Directory</h2>
          <p className="page-subtitle">
            Showing {groups.length} {groups.length === 1 ? 'study circle' : 'study circles'}
          </p>
        </div>
        {isAuthenticated && (
          <Link to="/create-group" className="btn btn-primary btn-sm">
            <PlusCircle size={16} />
            <span>New Group</span>
          </Link>
        )}
      </div>

      {/* Cards List or Loading / Empty States */}
      {loading ? (
        <LoadingSpinner message="Fetching campus study groups..." />
      ) : groups.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <BookOpen size={28} />
          </div>
          <h3 className="empty-title">No Study Groups Found</h3>
          <p className="empty-desc">
            {searchQuery || selectedSubject !== 'All' || selectedStatus !== 'All'
              ? 'No groups match your current search and filter criteria. Try resetting filters.'
              : 'There are currently no active study groups. Be the first to start one!'}
          </p>
          {isAuthenticated ? (
            <Link to="/create-group" className="btn btn-primary">
              <PlusCircle size={18} />
              <span>Create the First Group</span>
            </Link>
          ) : (
            <Link to="/register" className="btn btn-primary">
              <PlusCircle size={18} />
              <span>Sign Up to Create a Group</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="cards-grid">
          {groups.map((group) => (
            <GroupCard
              key={group._id}
              group={group}
              onJoinSuccess={handleJoinSuccess}
              onJoinError={handleJoinError}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupDirectory;
