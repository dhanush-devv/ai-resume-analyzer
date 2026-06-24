import React from 'react'
import { useAuth } from '../features/auth/hooks/useAuth'

const Navbar = () => {
  const { user, handleLogout } = useAuth()

  return (
    <header className="global-navbar">
      <div className="navbar-container">
        {/* Logo/Branding */}
        <div className="navbar-brand">
          <svg className="brand-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <path d="M12 12v6" />
            <path d="m9 15 3-3 3 3" />
          </svg>
          <span className="brand-text">Resume <span className="highlight">AI</span></span>
        </div>

        {/* User profile / actions */}
        {user && (
          <div className="navbar-user">
            <div className="user-profile">
              <div className="avatar">
                {user.username ? user.username[0].toUpperCase() : 'U'}
              </div>
              <span className="username">{user.username || 'User'}</span>
            </div>
            
            <button onClick={handleLogout} className="logout-btn" title="Sign Out">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="logout-icon">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar
