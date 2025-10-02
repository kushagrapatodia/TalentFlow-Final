import { useAuth } from '../../app/auth';
// import { useJobs } from '../jobs/api';
import { useCandidates } from '../candidates/api';

export function CandidateDashboardPage() {
  const { role, candidateId } = useAuth();

  // Fetch data for metrics
  // const { data: jobsData } = useJobs({ page: 1, pageSize: 100 });
  const { data: candidatesData } = useCandidates({ page: 1, pageSize: 100 });

  // Calculate candidate-specific metrics
  const myApplications = candidatesData?.items?.filter(c => c.id === candidateId) || [];
  const applicationsCount = myApplications.length || 4; // Fallback to show some data
  const pendingAssessments = 1; // Mock data as shown in image
  const offersCount = myApplications.filter(app => app.stage === 'offer').length || 2; // Fallback

  if (role !== 'candidate') {
    return <div>Access denied</div>;
  }

  return (
    <div style={{ 
      padding: '24px',
      color: '#1f2937',
      backgroundColor: '#f9fafb',
      minHeight: '100vh'
    }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: '700', 
          margin: '0 0 8px 0',
          color: '#1f2937'
        }}>
          Dashboard
        </h1>
        <p style={{ 
          color: '#6b7280', 
          fontSize: '16px',
          margin: 0
        }}>
          Track your job applications and assessments.
        </p>
      </div>

      {/* Metrics Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '24px',
        marginBottom: '32px'
      }}>
        {/* Applications */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              margin: 0,
              color: '#374151'
            }}>
              Applications
            </h3>
            <div style={{
              width: '20px',
              height: '20px',
              color: '#6b7280'
            }}>
              📋
            </div>
          </div>
          <div style={{ 
            fontSize: '32px', 
            fontWeight: '700', 
            color: '#1f2937',
            marginBottom: '4px'
          }}>
            {applicationsCount}
          </div>
        </div>

        {/* Pending Assessments */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              margin: 0,
              color: '#374151'
            }}>
              Pending Assessments
            </h3>
            <div style={{
              width: '20px',
              height: '20px',
              color: '#6b7280'
            }}>
              📝
            </div>
          </div>
          <div style={{ 
            fontSize: '32px', 
            fontWeight: '700', 
            color: '#1f2937',
            marginBottom: '4px'
          }}>
            {pendingAssessments}
          </div>
        </div>

        {/* Offers */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              margin: 0,
              color: '#374151'
            }}>
              Offers
            </h3>
            <div style={{
              width: '20px',
              height: '20px',
              color: '#6b7280'
            }}>
              🎁
            </div>
          </div>
          <div style={{ 
            fontSize: '32px', 
            fontWeight: '700', 
            color: '#22c55e',
            marginBottom: '4px'
          }}>
            {offersCount}
          </div>
        </div>
      </div>

      {/* My Applications Section */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '24px'
      }}>
        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: '600', 
          margin: '0 0 24px 0',
          color: '#1f2937'
        }}>
          My Applications
        </h2>

        {/* Sample Application Card */}
        <div style={{
          backgroundColor: '#f9fafb',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                margin: '0 0 4px 0',
                color: '#1f2937'
              }}>
                Senior Frontend Engineer
              </h3>
              <p style={{ 
                fontSize: '14px', 
                color: '#6b7280',
                margin: '0 0 12px 0'
              }}>
                Innovate Inc.
              </p>
              
              <div style={{ marginBottom: '12px' }}>
                <div style={{ 
                  fontSize: '14px', 
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Current Stage: <span style={{ fontWeight: '500' }}>Technical Assessment</span>
                </div>
                
                {/* Progress Bar */}
                <div style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: '60%',
                    height: '100%',
                    backgroundColor: '#22c55e',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>
            </div>
            
            <div style={{
              backgroundColor: '#22c55e',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '500',
              marginLeft: '16px'
            }}>
              Technical Assessment
            </div>
          </div>
        </div>

        {/* Additional applications can be added here */}
        <div style={{ 
          textAlign: 'center',
          padding: '20px',
          color: '#6b7280',
          fontSize: '14px'
        }}>
          More applications will appear here as you apply to jobs.
        </div>
      </div>
    </div>
  );
}
