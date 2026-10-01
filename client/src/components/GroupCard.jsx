import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, Users, ArrowRight, UserCheck, Lock, UserPlus } from 'lucide-react';

const GroupCard = ({ group, onJoinSuccess, onJoinError }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [joining, setJoining] = useState(false);

  const memberCount = group.members ? group.members.length : 0;
  const isFull = memberCount >= group.maxMembers || group.status === 'Full';
  const remainingSlots = Math.max(0, group.maxMembers - memberCount);

  // Check if current user is already member/creator
  const isUserMember =
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

  const handleJoinClick = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/groups/${group._id}` } });
      return;
    }

    if (isUserMember || isFull) return;

    setJoining(true);
    try {
      if (onJoinSuccess) {
        await onJoinSuccess(group._id);
      }
    } catch (err) {
      if (onJoinError) {
        onJoinError(err.message || 'Failed to join group');
      }
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="group-card">
      <div>
        {/* Header: Subject badge & Status */}
        <div className="card-top-row">
          <span className="badge badge-subject">{group.subject}</span>
          <span className={`badge ${isFull ? 'badge-full' : 'badge-open'}`}>
            {isFull ? 'Full' : 'Open'}
          </span>
        </div>

        {/* Title */}
        <h3 className="card-title">{group.groupName}</h3>

        {/* Description */}
        <p className="card-desc" title={group.description}>
          {group.description}
        </p>

        {/* Meeting & Creator Info */}
        <div className="card-meta-list">
          <div className="meta-item">
            <Calendar size={16} />
            <span style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {group.meetingInfo}
            </span>
          </div>

          <div className="meta-item">
            <Users size={16} />
            <span>
              Lead: <strong>{group.creator?.name || 'Group Creator'}</strong>{' '}
              {group.creator?.department ? `(${group.creator.department})` : ''}
            </span>
          </div>
        </div>

        {/* Capacity & Progress */}
        <div className="capacity-progress-container">
          <div className="capacity-labels">
            <span>
              Members: {memberCount} / {group.maxMembers}
            </span>
            <span style={{ color: isFull ? 'var(--danger-600)' : 'var(--success-600)' }}>
              {isFull ? '0 slots left' : `${remainingSlots} slot${remainingSlots === 1 ? '' : 's'} left`}
            </span>
          </div>
          <div className="progress-bar-bg">
            <div
              className={`progress-bar-fill ${isFull ? 'full' : 'open'}`}
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="card-actions">
        <Link to={`/groups/${group._id}`} className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
          <span>View Details</span>
          <ArrowRight size={14} />
        </Link>

        {isUserMember ? (
          <button
            type="button"
            className="btn btn-success btn-sm"
            disabled
            style={{ width: '100%' }}
            title={isCreator ? 'You created this group' : 'You are an active member'}
          >
            <UserCheck size={14} />
            <span>{isCreator ? 'Creator' : 'Joined'}</span>
          </button>
        ) : isFull ? (
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            disabled
            style={{ width: '100%', opacity: 0.55 }}
            title="Capacity reached. No additional members can join."
          >
            <Lock size={14} />
            <span>Group Full</span>
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={handleJoinClick}
            disabled={joining}
            style={{ width: '100%' }}
          >
            {joining ? (
              <>
                <div className="spinner-sm"></div>
                <span>Joining...</span>
              </>
            ) : (
              <>
                <UserPlus size={14} />
                <span>Join Group</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default GroupCard;
