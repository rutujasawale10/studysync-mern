import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import Alert from '../components/Alert';
import { PlusCircle, Book, Calendar, Users, FileText, ArrowLeft, CheckCircle2 } from 'lucide-react';

const COMMON_SUBJECT_SUGGESTIONS = [
  'Web Development',
  'Data Structures & Algorithms',
  'Database Management',
  'Machine Learning',
  'Operating Systems',
  'Computer Networks',
  'Cyber Security',
  'Cloud Computing',
  'Software Engineering'
];

const CreateGroup = () => {
  const [formData, setFormData] = useState({
    groupName: '',
    subject: '',
    description: '',
    meetingInfo: '',
    maxMembers: 5
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubjectSelect = (subject) => {
    setFormData((prev) => ({ ...prev, subject }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { groupName, subject, description, meetingInfo, maxMembers } = formData;

    if (!groupName.trim() || !subject.trim() || !description.trim() || !meetingInfo.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    const parsedMax = parseInt(maxMembers, 10);
    if (isNaN(parsedMax) || parsedMax < 2) {
      setError('Maximum capacity must be at least 2 members.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/groups', {
        groupName: groupName.trim(),
        subject: subject.trim(),
        description: description.trim(),
        meetingInfo: meetingInfo.trim(),
        maxMembers: parsedMax
      });

      if (res.data.success && res.data.group) {
        navigate(`/groups/${res.data.group._id}`, {
          state: { message: 'Group created successfully! You are now the Lead Creator.' }
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to create group. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
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

      <div className="card" style={{ padding: '2.25rem 2rem' }}>
        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
            <div className="brand-icon" style={{ width: '36px', height: '36px' }}>
              <PlusCircle size={20} />
            </div>
            <h1 style={{ fontSize: '1.65rem' }}>Create a New Study Group</h1>
          </div>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.92rem' }}>
            Launch a collaborative study circle for your course, exam prep, or practical lab projects.
          </p>
        </div>

        {error && <Alert type="danger" message={error} onClose={() => setError('')} />}

        <form onSubmit={handleSubmit}>
          {/* Group Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="groupName">
              Group Name <span className="required">*</span>
            </label>
            <input
              id="groupName"
              name="groupName"
              type="text"
              className="form-input"
              placeholder="e.g. Algorithms & Dynamic Programming Sprint"
              value={formData.groupName}
              onChange={handleChange}
              required
              maxLength={100}
            />
            <span className="form-hint">A catchy and clear title for your peer study group</span>
          </div>

          {/* Subject */}
          <div className="form-group">
            <label className="form-label" htmlFor="subject">
              Subject / Course Title <span className="required">*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="subject"
                name="subject"
                type="text"
                className="form-input"
                placeholder="e.g. Data Structures & Algorithms, Machine Learning..."
                value={formData.subject}
                onChange={handleChange}
                required
                maxLength={80}
              />
            </div>
            {/* Quick suggestions */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.5rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--gray-500)', alignSelf: 'center' }}>
                Suggestions:
              </span>
              {COMMON_SUBJECT_SUGGESTIONS.slice(0, 5).map((subj) => (
                <button
                  key={subj}
                  type="button"
                  onClick={() => handleSubjectSelect(subj)}
                  className="badge badge-subject"
                  style={{ cursor: 'pointer' }}
                >
                  + {subj}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label" htmlFor="description">
              Topic & Goals Description <span className="required">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              className="form-textarea"
              rows={4}
              placeholder="Describe what your group will cover, target exams, projects, or prerequisites..."
              value={formData.description}
              onChange={handleChange}
              required
              maxLength={1000}
            />
            <span className="form-hint">Detailed summary of study topics and objectives</span>
          </div>

          {/* Meeting Info & Max Capacity Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem' }}>
            {/* Meeting Info */}
            <div className="form-group">
              <label className="form-label" htmlFor="meetingInfo">
                Meeting Schedule / Platform Link <span className="required">*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="meetingInfo"
                  name="meetingInfo"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Every Tue & Thu 5:00 PM | Google Meet: meet.google.com/xyz"
                  value={formData.meetingInfo}
                  onChange={handleChange}
                  required
                  maxLength={200}
                />
              </div>
              <span className="form-hint">Time slot, physical room, or virtual meeting link</span>
            </div>

            {/* Max Members */}
            <div className="form-group">
              <label className="form-label" htmlFor="maxMembers">
                Max Capacity <span className="required">*</span>
              </label>
              <input
                id="maxMembers"
                name="maxMembers"
                type="number"
                min={2}
                max={50}
                className="form-input"
                value={formData.maxMembers}
                onChange={handleChange}
                required
              />
              <span className="form-hint">Min: 2 members</span>
            </div>
          </div>

          {/* Creator Note info */}
          <div
            style={{
              background: 'var(--primary-50)',
              border: '1px solid var(--primary-100)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              fontSize: '0.86rem',
              color: 'var(--primary-900)',
              marginTop: '0.5rem',
              marginBottom: '1.5rem'
            }}
          >
            <CheckCircle2 size={18} color="var(--primary-600)" flexShrink={0} />
            <span>
              As the group creator, you will automatically be registered as the first member with role{' '}
              <strong>"Creator"</strong>.
            </span>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <Link to="/groups" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <div className="spinner-sm"></div>
                  <span>Creating Group...</span>
                </>
              ) : (
                <>
                  <PlusCircle size={18} />
                  <span>Publish Study Group</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroup;
