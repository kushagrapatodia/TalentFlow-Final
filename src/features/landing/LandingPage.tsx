import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/auth';

export function LandingPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRecruiterLogin = () => {
    console.log('Direct HR login');
    login('hr');
    navigate('/dashboard');
  };

  const handleCandidateLogin = () => {
    console.log('Direct candidate login');
    login('candidate');
    navigate('/candidate/dashboard');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#ffffff', 
      color: '#333333',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header Section */}
      <section style={{ 
        textAlign: 'center', 
        paddingTop: 80, 
        paddingBottom: 60,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '80px 24px 60px'
      }}>
        {/* Logo and Title */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            marginBottom: 24,
            gap: 12
          }}>
            <div style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              backgroundColor: '#22c55e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 24,
              fontWeight: 'bold'
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="8" r="3" stroke="white" strokeWidth="2" fill="none"/>
                <path d="M12 14c-4 0-7 2-7 4v2h14v-2c0-2-3-4-7-4z" stroke="white" strokeWidth="2" fill="none"/>
              </svg>
            </div>
            <h1 style={{ 
              fontSize: 64, 
              margin: 0, 
              lineHeight: 1.1,
              fontWeight: 700,
              color: '#1f2937'
            }}>
              TalentFlow
            </h1>
          </div>
          <p style={{ 
            fontSize: 24, 
            color: '#6b7280', 
            marginTop: 16,
            fontWeight: 400
          }}>
            Your All-in-One Hiring Platform.
          </p>
        </div>

        {/* Main Content Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: 40, 
          marginTop: 60,
          maxWidth: '900px',
          margin: '60px auto 0',
          alignItems: 'stretch'
        }}>
          {/* For Recruiters */}
          <div style={{ 
            padding: 40, 
            textAlign: 'left',
            backgroundColor: '#ffffff',
            borderRadius: 12,
            border: '1px solid #e5e7eb',
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
          }}>
            <h2 style={{ 
              fontSize: 32, 
              marginTop: 0, 
              marginBottom: 16,
              color: '#1f2937',
              fontWeight: 600
            }}>
              For Recruiters
            </h2>
            <p style={{ 
              color: '#6b7280', 
              fontSize: 16,
              lineHeight: 1.6,
              marginBottom: 24
            }}>
              Streamline your hiring process, manage candidates, and build your dream team.
            </p>
            <p style={{ 
              color: '#6b7280', 
              fontSize: 16,
              lineHeight: 1.6,
              marginBottom: 32,
              flex: 1
            }}>
              Access the recruiter dashboard to manage job postings, review candidates, and conduct assessments.
            </p>
            <button 
              onClick={handleRecruiterLogin}
              style={{ 
                backgroundColor: '#22c55e',
                color: 'white',
                padding: '12px 24px',
                borderRadius: 8,
                textDecoration: 'none',
                fontWeight: 500,
                fontSize: 16,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                border: 'none',
                cursor: 'pointer',
                alignSelf: 'flex-start'
              }}
            >
              Recruiter Login →
            </button>
          </div>

          {/* For Candidates */}
          <div style={{ 
            padding: 40, 
            textAlign: 'left',
            backgroundColor: '#ffffff',
            borderRadius: 12,
            border: '1px solid #e5e7eb',
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
          }}>
            <h2 style={{ 
              fontSize: 32, 
              marginTop: 0, 
              marginBottom: 16,
              color: '#1f2937',
              fontWeight: 600
            }}>
              For Candidates
            </h2>
            <p style={{ 
              color: '#6b7280', 
              fontSize: 16,
              lineHeight: 1.6,
              marginBottom: 24
            }}>
              Find your next career opportunity and showcase your skills.
            </p>
            <p style={{ 
              color: '#6b7280', 
              fontSize: 16,
              lineHeight: 1.6,
              marginBottom: 32,
              textAlign: 'center',
              flex: 1
            }}>
              Browse open positions, apply for jobs, and complete skill assessments.
            </p>
            <button 
              onClick={handleCandidateLogin}
              style={{ 
                backgroundColor: '#22c55e',
                color: 'white',
                padding: '12px 24px',
                borderRadius: 8,
                textDecoration: 'none',
                fontWeight: 500,
                fontSize: 16,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                border: 'none',
                cursor: 'pointer',
                alignSelf: 'flex-start'
              }}
            >
              Candidate Login →
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ 
        textAlign: 'center', 
        padding: '24px',
        color: '#6b7280',
        fontSize: 14,
        borderTop: '1px solid #e5e7eb',
        backgroundColor: '#ffffff'
      }}>
        Copyright © 2025 TalentFlow. All rights reserved.
      </footer>
    </div>
  );
}


