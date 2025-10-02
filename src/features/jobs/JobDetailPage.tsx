import { useParams, Link } from 'react-router-dom';
import { useJob } from './api';
import { useAuth } from '../../app/auth';
import { useState } from 'react';

export function JobDetailPage() {
  const { jobId = '' } = useParams();
  const { data: job, isLoading, isError } = useJob(jobId);
  const { role, candidateId } = useAuth();
  const [applied, setApplied] = useState(false);
  const [loading, setLoading] = useState(false);

  if (isLoading) {
    return (
      <div style={{ 
        padding: '24px',
        color: '#1f2937',
        backgroundColor: '#f9fafb',
        minHeight: '100vh'
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '32px',
          textAlign: 'center',
          color: '#6b7280'
        }}>
          Loading job details…
        </div>
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div style={{ 
        padding: '24px',
        color: '#1f2937',
        backgroundColor: '#f9fafb',
        minHeight: '100vh'
      }}>
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '12px',
          padding: '32px',
          textAlign: 'center',
          color: '#dc2626'
        }}>
          Job not found or failed to load.
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '24px',
      color: '#1f2937',
      backgroundColor: '#f9fafb',
      minHeight: '100vh'
    }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: '24px' }}>
        <Link 
          to="/jobs" 
          style={{ 
            color: '#6b7280', 
            textDecoration: 'none',
            fontSize: '14px'
          }}
        >
          ← Back to Jobs
        </Link>
      </div>

      {/* Job Header */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '32px',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ 
              fontSize: '36px', 
              fontWeight: '700', 
              margin: '0 0 8px 0',
              color: '#1f2937'
            }}>
              {job.title}
            </h1>
            
            <div style={{ 
              display: 'flex', 
              gap: '8px', 
              marginBottom: '16px',
              flexWrap: 'wrap'
            }}>
              {job.tags.map((tag: string, index: number) => (
                <span key={index} style={{
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  {tag}
                </span>
              ))}
              <span style={{
                backgroundColor: job.status === 'active' ? '#dcfce7' : '#f3f4f6',
                color: job.status === 'active' ? '#166534' : '#6b7280',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
              </span>
            </div>

            <div style={{ 
              color: '#6b7280', 
              fontSize: '14px',
              marginBottom: '16px'
            }}>
              Job ID: {job.slug}
            </div>
          </div>
          
          {role === 'candidate' && job.status === 'active' && (
            <button
              style={{
                backgroundColor: applied ? '#6b7280' : '#22c55e',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontWeight: '500',
                fontSize: '16px',
                cursor: applied ? 'default' : 'pointer',
                marginLeft: '24px',
                opacity: loading ? 0.7 : 1
              }}
              disabled={applied || loading}
              onClick={async () => {
                if (applied || loading) return;
                setLoading(true);
                try {
                  // Simulate API call to apply
                  await fetch('/candidates', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ jobId, candidateId, stage: 'applied' })
                  });
                  setApplied(true);
                } catch (e) {
                  alert('Failed to apply. Please try again.');
                }
                setLoading(false);
              }}
            >
              {applied ? 'Applied' : loading ? 'Applying...' : 'Apply Now'}
            </button>
          )}
        </div>
      </div>

      {/* Job Description */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '32px',
        marginBottom: '24px'
      }}>
        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: '600', 
          margin: '0 0 16px 0',
          color: '#1f2937'
        }}>
          Job Description
        </h2>
        <div style={{ 
          color: '#374151', 
          lineHeight: '1.6',
          fontSize: '16px'
        }}>
          <p>We are looking for a talented {job.title.toLowerCase()} to join our growing team. This is an exciting opportunity to work on cutting-edge projects and make a significant impact.</p>
          
          <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '24px 0 12px 0' }}>
            Responsibilities:
          </h3>
          <ul style={{ paddingLeft: '20px', margin: '0 0 16px 0' }}>
            <li style={{ marginBottom: '8px' }}>Develop and maintain high-quality software solutions</li>
            <li style={{ marginBottom: '8px' }}>Collaborate with cross-functional teams</li>
            <li style={{ marginBottom: '8px' }}>Participate in code reviews and technical discussions</li>
            <li style={{ marginBottom: '8px' }}>Contribute to architectural decisions</li>
          </ul>

          <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '24px 0 12px 0' }}>
            Requirements:
          </h3>
          <ul style={{ paddingLeft: '20px', margin: '0' }}>
            <li style={{ marginBottom: '8px' }}>3+ years of relevant experience</li>
            <li style={{ marginBottom: '8px' }}>Strong problem-solving skills</li>
            <li style={{ marginBottom: '8px' }}>Excellent communication abilities</li>
            <li style={{ marginBottom: '8px' }}>Bachelor's degree in Computer Science or related field</li>
          </ul>
        </div>
      </div>

      {/* HR Actions */}
      {role === 'hr' && (
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '32px'
        }}>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: '600', 
            margin: '0 0 16px 0',
            color: '#1f2937'
          }}>
            Management Actions
          </h2>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link 
              to={`/assessments/${jobId}`}
              style={{
                backgroundColor: '#22c55e',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontWeight: '500',
                textDecoration: 'none',
                display: 'inline-block'
              }}
            >
              Build Assessment
            </Link>
            <button style={{
              backgroundColor: '#f3f4f6',
              color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              padding: '12px 24px',
              fontWeight: '500',
              cursor: 'pointer'
            }}>
              Edit Job
            </button>
            <button style={{
              backgroundColor: job.status === 'active' ? '#fef2f2' : '#dcfce7',
              color: job.status === 'active' ? '#dc2626' : '#166534',
              border: `1px solid ${job.status === 'active' ? '#fecaca' : '#bbf7d0'}`,
              borderRadius: '8px',
              padding: '12px 24px',
              fontWeight: '500',
              cursor: 'pointer'
            }}>
              {job.status === 'active' ? 'Archive Job' : 'Activate Job'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
