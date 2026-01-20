import React, { useState, useEffect, useRef } from 'react';
import { useLogout, useGetIdentity } from '@refinedev/core';
import { useNavigate } from 'react-router';
import '../kensan.css';

interface SidebarProps {
  activeItem?: string;
}

function Sidebar({ activeItem: initialActiveItem = 'dashboard' }: SidebarProps) {
  const [activeItem, setActiveItem] = useState(initialActiveItem);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('kensan-theme');
    return saved === 'dark' || saved === null;
  });
  const [showLogoutMenu, setShowLogoutMenu] = useState<boolean | 'closing'>(false);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Logo path based on theme
  const logoSrc = isDarkMode ? '/logo_dark.png' : '/logo_light.png';
  
  const { mutate: logout } = useLogout();
  const { data: identity, refetch } = useGetIdentity();
  const navigate = useNavigate();
  
  const username = identity?.name || identity?.email?.split('@')[0] || 'Guest';
  const profilePicture = identity?.profile_picture;
  const menuRef = useRef<HTMLDivElement>(null);

  // Initialize theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('kensan-theme');
    if (savedTheme === 'light') {
      document.documentElement.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
    }
  }, []);

  // Listen for profile updates
  useEffect(() => {
    const handleProfileUpdate = () => {
      refetch();
      setRefreshKey(prev => prev + 1);
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, [refetch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        if (showLogoutMenu === true) {
          setShowLogoutMenu('closing');
        }
      }
    };

    if (showLogoutMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLogoutMenu]);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    if (newMode) {
      // Dark mode
      document.documentElement.classList.remove('light-mode');
      localStorage.setItem('kensan-theme', 'dark');
    } else {
      // Light mode
      document.documentElement.classList.add('light-mode');
      localStorage.setItem('kensan-theme', 'light');
    }
  };

  return (
    <div className="kensan-sidebar">
      <div style={{ padding: '10px 0.5rem 1rem' }}>
        <img 
          src={logoSrc} 
          alt="Kensan Logo" 
          className="kensan-sidebar-logo"
        />
      </div>

      <div className="kensan-divider" />

      <nav className="kensan-menu">
        <MenuItem 
          icon="dashboard"
          label="Dashboard"
          isActive={activeItem === 'dashboard'}
          onClick={() => {
            setActiveItem('dashboard');
            navigate('/');
          }}
        />
        <MenuItem 
          icon="shelves"
          label="Overview"
          isActive={activeItem === 'overview'}
          onClick={() => setActiveItem('overview')}
        />
        <MenuItem 
          icon="person_add"
          label="Create Account"
          isActive={activeItem === 'create-account'}
          onClick={() => {
            setActiveItem('create-account');
            navigate('/create-account');
          }}
        />
        <MenuItem 
          icon="file_save"
          label="Documentation"
          isActive={activeItem === 'documentation'}
          onClick={() => setActiveItem('documentation')}
        />
      </nav>

      <div className="kensan-sidebar-footer">
        <div style={{ padding: '0.35rem 0.6rem' }}>
          <button 
            className={`kensan-theme-toggle-btn ${!isDarkMode ? 'light' : ''}`}
            onClick={toggleTheme}
          >
            <span className="material-symbols-outlined kensan-theme-icon sunny">
              sunny
            </span>
            <span className="material-symbols-outlined kensan-theme-icon dark_mode">
              dark_mode
            </span>
          </button>
        </div>

        <div className="kensan-divider" style={{ margin: 0 }} />

        <div className="kensan-user-info" style={{ position: 'relative' }} ref={menuRef}>
          <div className="kensan-user-icon">
            {profilePicture ? (
              <img 
                src={profilePicture.startsWith('http') 
                  ? profilePicture 
                  : `http://localhost:3000/profile_pictures/${profilePicture}`
                } 
                alt="Profile" 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '50%'
                }}
              />
            ) : (
              <span className="material-symbols-outlined">
                person
              </span>
            )}
          </div>

          <span className="kensan-user-status" style={{ flex: 1 }}>
            {username}
          </span>

          <div 
            className="kensan-user-icon" 
            style={{ cursor: 'pointer' }}
            onClick={() => setShowLogoutMenu(showLogoutMenu ? 'closing' : true)}
          >
            <span className="material-symbols-outlined">
              settings
            </span>
          </div>

          {showLogoutMenu && (
            <div
              className={`kensan-logout-menu ${showLogoutMenu === 'closing' ? 'closing' : ''}`}
              onAnimationEnd={() => {
                if (showLogoutMenu === 'closing') {
                  setShowLogoutMenu(false);
                }
              }}
            >
              <button
                onClick={() => {
                  setShowLogoutMenu(false);
                  navigate('/settings');
                }}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'var(--color-cyberdefense-orange)',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                  manage_accounts
                </span>
                Account Settings
              </button>
              <button
                onClick={() => {
                  setShowLogoutMenu(false);
                  logout();
                }}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'var(--color-cyberdefense-orange)',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                  logout
                </span>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * MENU ITEM - With white bar on left and right when active
 */
interface MenuItemProps {
  icon: string;
  label: string;
  isActive?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

function MenuItem({ icon, label, isActive = false, disabled = false, onClick }: MenuItemProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  return (
    <div 
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`kensan-menu-item ${isActive ? 'active' : ''}`}
      style={{
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        backgroundColor: (!disabled && !isActive && isHovered) ? 'rgba(255,255,255,0.02)' : undefined
      }}
    >
      <span className="material-symbols-outlined">
        {icon}
      </span>
      <span className="kensan-menu-item-label">
        {label}
      </span>
      
      {/* White bar on the right with fade animation */}
      {isActive && (
        <div className="kensan-menu-indicator" />
      )}
    </div>
  );
}

export default Sidebar;
