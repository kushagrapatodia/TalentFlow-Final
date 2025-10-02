import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../app/auth';

export function RootLayout() {
  const { role, logout } = useAuth();
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  
  return (
    <div>
      {!isLandingPage && (
        <header style={{ position: 'sticky', top: 0, zIndex: 5, backdropFilter: 'saturate(180%) blur(8px)', background: 'linear-gradient(90deg,#0f172a,#111827)', borderBottom: '1px solid #1f2937' }}>
          <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, paddingBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
              <strong style={{ letterSpacing: .3 }}>TalentFlow</strong>
            </div>
            <nav className="row">
              {!role && <Link to="/" className="btn secondary">Home</Link>}
              {role && <Link to="/jobs" className="btn secondary">Jobs</Link>}
              {role === 'hr' && <Link to="/jobs?hasAssessment=1" className="btn secondary">Assessment Builder</Link>}
              {role === 'hr' && <Link to="/candidates" className="btn secondary">Candidates</Link>}
              {role === 'candidate' && <Link to="/assessments" className="btn">Assessments</Link>}
              {!role ? (
                <Link to="/login" className="btn">Login</Link>
              ) : (
                <button className="btn" onClick={logout}>Logout</button>
              )}
            </nav>
          </div>
        </header>
      )}
      <Outlet />
    </div>
  );
}


