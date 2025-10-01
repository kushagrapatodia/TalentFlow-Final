import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/auth';

export function LoginPage() {
  const { login, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (role) navigate(role === 'hr' ? '/jobs' : '/jobs');
  }, [role, navigate]);

  const params = new URLSearchParams(location.search);
  const suggested = params.get('as');

  return (
    <div className="container" style={{ paddingTop: 40, maxWidth: 520 }}>
      <h1 style={{ fontSize: 40, marginBottom: 8 }}>Sign in</h1>
      <p style={{ opacity: .9, marginTop: 0 }}>Choose how you want to continue.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
        <button className="btn" onClick={() => { login('candidate'); navigate('/jobs'); }} style={{ padding: 14, fontSize: 16, background: suggested === 'candidate' ? '#7c3aed' : undefined }}>
          Continue as Candidate
        </button>
        <button className="btn" onClick={() => { login('hr'); navigate('/jobs'); }} style={{ padding: 14, fontSize: 16, background: suggested === 'hr' ? '#7c3aed' : undefined }}>
          Continue as HR
        </button>
      </div>
    </div>
  );
}


