import { Link } from 'react-router-dom';

export function LandingPage() {
  return (
    <div style={{ paddingTop: 40 }}>
      <section className="container" style={{ textAlign: 'center', paddingTop: 40, paddingBottom: 40 }}>
        <h1 style={{ fontSize: 72, margin: 0, lineHeight: 1.1 }}>Welcome to <span style={{ color: '#7c3aed' }}>TalentFlow</span></h1>
        <p style={{ fontSize: 22, opacity: .9, marginTop: 16 }}>Streamline your hiring process with our powerful platform.<br/>Connect talented candidates with amazing opportunities.</p>
      </section>

      <section className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 12 }}>
        <div className="card" style={{ padding: 24, textAlign: 'center' }}>
          <div style={{ width: 72, height: 72, margin: '0 auto 12px', borderRadius: 999, background: '#ede9fe', display: 'grid', placeItems: 'center', color: '#7c3aed', fontSize: 32 }}>🎒</div>
          <h3 style={{ marginTop: 0 }}>For Candidates</h3>
          <p style={{ opacity: .9 }}>Find your dream job and showcase your skills.</p>
          <Link to="/login?as=candidate" className="btn" style={{ marginTop: 8, display: 'inline-block' }}>Get Started</Link>
        </div>
        <div className="card" style={{ padding: 24, textAlign: 'center' }}>
          <div style={{ width: 72, height: 72, margin: '0 auto 12px', borderRadius: 999, background: '#ede9fe', display: 'grid', placeItems: 'center', color: '#7c3aed', fontSize: 32 }}>👥</div>
          <h3 style={{ marginTop: 0 }}>For HR Teams</h3>
          <p style={{ opacity: .9 }}>Discover top talent and manage hiring efficiently.</p>
          <Link to="/login?as=hr" className="btn" style={{ marginTop: 8, display: 'inline-block' }}>Start Hiring</Link>
        </div>
      </section>

      <section className="container" style={{ marginTop: 64 }}>
        <h2 style={{ fontSize: 40, marginBottom: 16, textAlign: 'center' }}>Why Choose TalentFlow?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <div className="card" style={{ padding: 24 }}>
            <h4>Smart Matching</h4>
            <p style={{ opacity: .9 }}>AI-powered matching connects candidates with the perfect opportunities based on skills and experience.</p>
          </div>
          <div className="card" style={{ padding: 24 }}>
            <h4>Easy Assessments</h4>
            <p style={{ opacity: .9 }}>Create and manage assessments to evaluate candidates effectively and efficiently.</p>
          </div>
          <div className="card" style={{ padding: 24 }}>
            <h4>Seamless Collaboration</h4>
            <p style={{ opacity: .9 }}>Work together with your team to make better hiring decisions faster.</p>
          </div>
        </div>
      </section>
    </div>
  );
}


