import React from 'react';

const LoadingSpinner = ({ message = 'Loading StudySync data...' }) => {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p style={{ fontWeight: 500 }}>{message}</p>
    </div>
  );
};

export default LoadingSpinner;
