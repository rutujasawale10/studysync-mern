import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import GroupDirectory from './pages/GroupDirectory';
import GroupDetail from './pages/GroupDetail';
import CreateGroup from './pages/CreateGroup';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Root redirects to Groups Directory */}
              <Route path="/" element={<Navigate to="/groups" replace />} />
              
              {/* Public Routes */}
              <Route path="/groups" element={<GroupDirectory />} />
              <Route path="/groups/:id" element={<GroupDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route
                path="/create-group"
                element={
                  <ProtectedRoute>
                    <CreateGroup />
                  </ProtectedRoute>
                }
              />

              {/* Fallback 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <footer className="footer">
            <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '0 1.25rem' }}>
              <p>
                <strong>StudySync</strong> &copy; {new Date().getFullYear()} – Group Study Management System.
                Built for College Peer Learning & Collaborative Exam Prep.
              </p>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
