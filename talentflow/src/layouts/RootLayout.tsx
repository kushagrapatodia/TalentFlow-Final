import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../app/auth';

export function RootLayout() {
  const { role, logout } = useAuth();
  return (
    <div>
      <header style={{ position: 'sticky', top: 0, zIndex: 5, backdropFilter: 'saturate(180%) blur(8px)', background: 'linear-gradient(90deg,#0f172a,#111827)', borderBottom: '1px solid #1f2937' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, paddingBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 10, height: 10, borderRadius: 9999, background: '#60a5fa' }} />
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
      <Outlet />
    </div>
  );
}


