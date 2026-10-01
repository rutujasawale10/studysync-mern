import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import {
  ArrowLeft,
  Calendar,
  Users,
  Copy,
  Check,
  UserPlus,
  BookOpen,
  Edit3,
  Save,
  Trash2,
  ExternalLink,
  ShieldCheck,
  UserCheck,
  GraduationCap,
  Building,
  Lock
} from 'lucide-react';

const GroupDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(location.state?.message || '');

  // Meeting info copied state
  const [copied, setCopied] = useState(false);

  // Shared Notes editing state
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesContent, setNotesContent] = useState('');
  const [notesSaving, setNotesSaving] = useState(false);

  const fetchGroup = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get(`/groups/${id}`);
      if (res.data.success && res.data.group) {
        setGroup(res.data.group);
        setNotesContent(res.data.group.sharedNotes || '');
      }
    } catch (err) {
      setError(err.message || 'Failed to load study group details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroup();
  }, [id]);

  if (loading) {
    return <LoadingSpinner message="Loading group workspace..." />;
  }

  if (!group) {
    return (
      <div className="empty-state">
        <h3 className="empty-title">Group Not Found</h3>
        <p className="empty-desc">This study group does not exist or has been removed.</p>
        <Link to="/groups" className="btn btn-primary">
          Back to Groups
        </Link>
      </div>
    );
  }

  const memberCount = group.members ? group.members.length : 0;
  const isFull = memberCount >= group.maxMembers || group.status === 'Full';
  const remainingSlots = Math.max(0, group.maxMembers - memberCount);

  const isMember =
    isAuthenticated &&
    user &&
    group.members &&
    group.members.some((m) => {
      const memberId = m.user?._id || m.user;
      return memberId && memberId.toString() === user._id.toString();
    });

  const isCreator =
    isAuthenticated &&
    user &&
    (group.creator?._id?.toString() === user._id.toString() ||
      group.creator?.toString() === user._id.toString());

  const progressPercentage = Math.min(100, Math.round((memberCount / group.maxMembers) * 100));

  // Copy meeting info
  const handleCopyMeetingInfo = () => {
    if (group.meetingInfo) {
      navigator.clipboard.writeText(group.meetingInfo);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Join group
  const handleJoin = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/groups/${group._id}` } });
      return;
    }

    if (isMember || isFull) return;

    setActionLoading(true);
    setError('');
    try {
      const res = await api.post(`/groups/${group._id}/join`);
      if (res.data.success) {
        setSuccessMessage(res.data.message || 'Successfully joined the study group!');
        setGroup(res.data.group);
      }
    } catch (err) {
      setError(err.message || 'Failed to join group.');
    } finally {
      setActionLoading(false);
    }
  };

  // Save notes
  const handleSaveNotes = async () => {
    setNotesSaving(true);
    setError('');
    try {
      const res = await api.put(`/groups/${group._id}/notes`, {
        sharedNotes: notesContent
      });
      if (res.data.success) {
        setGroup(res.data.group);
        setIsEditingNotes(false);
        setSuccessMessage('Shared study notes saved successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      setError(err.message || 'Failed to save notes.');
    } finally {
      setNotesSaving(false);
    }
  };

  // Delete group (Creator only)
  const handleDeleteGroup = async () => {
    if (!window.confirm('Are you sure you want to delete this study group? This action cannot be undone.')) {
      return;
    }

    setActionLoading(true);
    try {
      const res = await api.delete(`/groups/${group._id}`);
      if (res.data.success) {
        navigate('/groups', {
          state: { message: 'Study group deleted successfully.' }
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to delete group.');
      setActionLoading(false);
    }
  };

  return (
    <div>
      {/* Back button */}
      <Link
        to="/groups"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          color: 'var(--gray-600)',
          fontWeight: 600,
          marginBottom: '1.25rem',
          fontSize: '0.9rem'
        }}
      >
        <ArrowLeft size={16} />
        <span>Back to Groups Directory</span>
      </Link>

      {/* Notifications */}
      {successMessage && (
        <Alert type="success" message={successMessage} onClose={() => setSuccessMessage('')} />
      )}
      {error && <Alert type="danger" message={error} onClose={() => setError('')} />}

      {/* Main Workspace Layout */}
      <div className="workspace-layout">
        {/* Left Column: Group Details & Shared Notes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Header Card */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <span className="badge badge-subject">{group.subject}</span>
                <span className={`badge ${isFull ? 'badge-full' : 'badge-open'}`}>
                  {isFull ? 'Group Full' : 'Open for Members'}
                </span>
                {isCreator && (
                  <span className="badge badge-creator">
                    <ShieldCheck size={12} /> Lead Creator
                  </span>
                )}
                {isMember && !isCreator && (
                  <span className="badge badge-member">
                    <UserCheck size={12} /> Member
                  </span>
                )}
              </div>

              {/* Creator Delete button */}
              {isCreator && (
                <button
                  type="button"
                  onClick={handleDeleteGroup}
                  className="btn btn-danger btn-sm"
                  disabled={actionLoading}
                  title="Delete this study group"
                >
                  <Trash2 size={14} />
                  <span>Delete Group</span>
                </button>
              )}
            </div>

            <h1 style={{ fontSize: '1.85rem', marginBottom: '0.75rem' }}>{group.groupName}</h1>

            <p style={{ color: 'var(--gray-700)', fontSize: '1rem', lineHeight: '1.7', marginBottom: '1.5rem' }}>
              {group.description}
            </p>

            {/* Meeting Schedule Box */}
            <div
              style={{
                background: 'var(--gray-100)',
                border: '1px solid var(--gray-200)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem 1.25rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--primary-100)',
                    color: 'var(--primary-700)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Calendar size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--gray-500)' }}>
                    Meeting Schedule & Location
                  </div>
                  <div style={{ fontWeight: 600, color: 'var(--gray-900)', fontSize: '0.95rem' }}>
                    {group.meetingInfo}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopyMeetingInfo}
                className="btn btn-secondary btn-sm"
                title="Copy schedule or link to clipboard"
              >
                {copied ? (
                  <>
                    <Check size={14} color="var(--success-600)" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Copy Info</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Shared Study Notes Section */}
          <div className="notes-editor-box">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BookOpen size={20} color="var(--primary-600)" />
                <h3 style={{ fontSize: '1.25rem' }}>Shared Study Notes & Syllabus</h3>
              </div>

              {isMember && !isEditingNotes && (
                <button
                  type="button"
                  onClick={() => setIsEditingNotes(true)}
                  className="btn btn-secondary btn-sm"
                >
                  <Edit3 size={14} />
                  <span>Edit Notes</span>
                </button>
              )}
            </div>

            {isEditingNotes ? (
              <div>
                <textarea
                  className="form-textarea"
                  rows={8}
                  value={notesContent}
                  onChange={(e) => setNotesContent(e.target.value)}
                  placeholder="Add formulas, meeting notes, project deadlines, references, and study links here..."
                  style={{ marginBottom: '1rem', fontFamily: 'inherit' }}
                />
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setNotesContent(group.sharedNotes || '');
                      setIsEditingNotes(false);
                    }}
                    className="btn btn-secondary btn-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveNotes}
                    className="btn btn-primary btn-sm"
                    disabled={notesSaving}
                  >
                    {notesSaving ? (
                      <>
                        <div className="spinner-sm"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save size={14} />
                        <span>Save Notes</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="notes-content-view">
                {group.sharedNotes ? (
                  group.sharedNotes
                ) : (
                  <span style={{ color: 'var(--gray-400)', fontStyle: 'italic' }}>
                    No shared study notes added yet. Group members can collaborate and add notes here!
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Capacity, Action, & Members List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Capacity Card & Join Action */}
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Group Capacity</h3>

            <div className="capacity-progress-container">
              <div className="capacity-labels">
                <span>
                  <strong>{memberCount}</strong> / {group.maxMembers} Students
                </span>
                <span style={{ color: isFull ? 'var(--danger-600)' : 'var(--success-600)' }}>
                  {isFull ? 'Capacity Full' : `${remainingSlots} slot${remainingSlots === 1 ? '' : 's'} available`}
                </span>
              </div>
              <div className="progress-bar-bg" style={{ height: '9px' }}>
                <div
                  className={`progress-bar-fill ${isFull ? 'full' : 'open'}`}
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* CTA Join Button */}
            <div style={{ marginTop: '1.25rem' }}>
              {isUserMember ? (
                <div
                  style={{
                    padding: '0.75rem',
                    background: 'var(--success-50)',
                    border: '1px solid var(--success-100)',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center',
                    color: 'var(--success-700)',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <UserCheck size={18} />
                  <span>{isCreator ? 'You are the Group Leader' : 'You are an enrolled Member'}</span>
                </div>
              ) : isFull ? (
                <button
                  type="button"
                  className="btn btn-secondary btn-block"
                  disabled
                  style={{ opacity: 0.6 }}
                >
                  <Lock size={16} />
                  <span>Group is Full</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary btn-block btn-lg"
                  onClick={handleJoin}
                  disabled={actionLoading}
                >
                  {actionLoading ? (
                    <>
                      <div className="spinner-sm"></div>
                      <span>Joining...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus size={18} />
                      <span>Join This Study Group</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Members List Card */}
          <div className="card">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={18} color="var(--primary-600)" />
                <h3 style={{ fontSize: '1.15rem' }}>Enrolled Members</h3>
              </div>
              <span className="badge badge-subject" style={{ fontSize: '0.75rem' }}>
                {memberCount} Active
              </span>
            </div>

            <div className="member-list">
              {group.members && group.members.length > 0 ? (
                group.members.map((member, idx) => {
                  const student = member.user || {};
                  const isLeadRole = member.role === 'Creator';

                  return (
                    <div key={member._id || idx} className="member-item">
                      <div className="member-info">
                        <div
                          className="member-avatar"
                          style={{
                            background: isLeadRole
                              ? 'linear-gradient(135deg, var(--primary-600), var(--secondary-600))'
                              : 'var(--gray-600)'
                          }}
                        >
                          {student.name ? student.name.charAt(0).toUpperCase() : 'S'}
                        </div>
                        <div className="member-details">
                          <h4>{student.name || 'Student Member'}</h4>
                          <p>
                            {student.department || 'Department N/A'}
                            {student.semester ? ` • ${student.semester}` : ''}
                          </p>
                        </div>
                      </div>

                      <span className={`badge ${isLeadRole ? 'badge-creator' : 'badge-member'}`}>
                        {member.role || 'Member'}
                      </span>
                    </div>
                  );
                })
              ) : (
                <p style={{ color: 'var(--gray-500)', fontSize: '0.88rem' }}>No members found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetail;
