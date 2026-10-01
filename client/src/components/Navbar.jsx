import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Users, PlusCircle, LogOut, LogIn, UserPlus } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Brand Logo */}
        <Link to="/groups" className="brand-link">
          <div className="brand-icon">
            <BookOpen size={22} />
          </div>
          <span>
            Study<span className="brand-highlight">Sync</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="nav-menu">
          <NavLink
            to="/groups"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            <Users size={18} />
            <span>Groups Directory</span>
          </NavLink>

          {isAuthenticated ? (
            <>
              <NavLink
                to="/create-group"
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                <PlusCircle size={18} />
                <span>Create Group</span>
              </NavLink>

              {/* Student Profile Info */}
              <div className="user-profile-badge" title={`${user?.department || ''} (${user?.semester || ''})`}>
                <div className="user-avatar">
                  {user?.name ? user.name.charAt(0) : 'S'}
                </div>
                <span className="user-name-text">{user?.name}</span>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="btn btn-secondary btn-sm"
                title="Log out of your account"
                style={{ padding: '0.4rem 0.75rem' }}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">
                <LogIn size={16} />
                <span>Login</span>
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                <UserPlus size={16} />
                <span>Register</span>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
