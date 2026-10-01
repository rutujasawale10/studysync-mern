import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="empty-state" style={{ margin: '4rem auto', maxWidth: '500px' }}>
      <div className="empty-icon" style={{ width: '64px', height: '64px' }}>
        <HelpCircle size={32} />
      </div>
      <h1 className="empty-title" style={{ fontSize: '1.75rem' }}>404 - Page Not Found</h1>
      <p className="empty-desc">
        The study group or resource page you are looking for does not exist or has been relocated.
      </p>
      <Link to="/groups" className="btn btn-primary">
        <Home size={18} />
        <span>Return to Groups Directory</span>
      </Link>
    </div>
  );
};

export default NotFound;
