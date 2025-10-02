import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../app/auth';

export function CandidateLayout() {
  const { logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/candidate/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/jobs', label: 'Jobs', icon: '💼' },
  ];

  const isActive = (path: string) => {
    if (path === '/candidate/dashboard') {
      return location.pathname === '/candidate/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div style={{
        width: '280px',
        backgroundColor: '#1f2937',
        color: 'white',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Logo */}
        <div style={{ 
          padding: '24px', 
          borderBottom: '1px solid #374151',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{ 
            width: 32, 
            height: 32, 
            borderRadius: '50%', 
            backgroundColor: '#22c55e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="8" r="3" stroke="white" strokeWidth="2" fill="none"/>
              <path d="M12 14c-4 0-7 2-7 4v2h14v-2c0-2-3-4-7-4z" stroke="white" strokeWidth="2" fill="none"/>
            </svg>
          </div>
          <span style={{ 
            fontSize: '20px', 
            fontWeight: '700',
            letterSpacing: '0.3px'
          }}>
            TalentFlow
          </span>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '16px 0' }}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 24px',
                color: isActive(item.path) ? '#22c55e' : '#d1d5db',
                backgroundColor: isActive(item.path) ? '#374151' : 'transparent',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: isActive(item.path) ? '600' : '400',
                borderRight: isActive(item.path) ? '3px solid #22c55e' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Bottom Section */}
        <div style={{ 
          padding: '16px 24px', 
          borderTop: '1px solid #374151' 
        }}>
          {/* User Profile */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 0',
            marginBottom: '12px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#22c55e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px'
            }}>
              👤
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ 
                fontSize: '14px', 
                fontWeight: '600',
                color: 'white'
              }}>
                Candidate
              </div>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 0',
              background: 'none',
              border: 'none',
              color: '#d1d5db',
              fontSize: '16px',
              cursor: 'pointer',
              width: '100%',
              textAlign: 'left'
            }}
          >
            <span style={{ fontSize: '18px' }}>🚪</span>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ 
        flex: 1, 
        backgroundColor: '#f9fafb',
        overflow: 'auto'
      }}>
        <Outlet />
      </div>
    </div>
  );
}
