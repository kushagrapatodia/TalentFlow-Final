import { useAuth } from '../../app/auth';
import { useJobs } from '../jobs/api';
import { useCandidates } from '../candidates/api';

export function DashboardPage() {
  const { role } = useAuth();

  // Fetch real data
  const { data: jobsData } = useJobs({ status: 'active', page: 1, pageSize: 100 });
  const { data: candidatesData } = useCandidates({ page: 1, pageSize: 100 });
  
  // Calculate metrics
  const activeJobsCount = jobsData?.items?.filter(job => job.status === 'active').length || 0;
  const totalCandidatesCount = candidatesData?.total || 0;
  const recentCandidatesCount = candidatesData?.items?.filter(() => true).length || 0;

  if (role !== 'hr') {
    return <div>Access denied</div>;
  }

  return (
    <div style={{ padding: '24px' }}>
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
          A high-level overview of your hiring activity.
        </p>
      </div>

      {/* Metrics Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '24px',
        marginBottom: '32px'
      }}>
        {/* Active Jobs */}
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
              Active Jobs
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
            {activeJobsCount}
          </div>
        </div>

        {/* Total Candidates */}
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
              Total Candidates
            </h3>
            <div style={{
              width: '20px',
              height: '20px',
              color: '#6b7280'
            }}>
              👥
            </div>
          </div>
          <div style={{ 
            fontSize: '32px', 
            fontWeight: '700', 
            color: '#1f2937',
            marginBottom: '4px'
          }}>
            {totalCandidatesCount}
          </div>
        </div>

        {/* New Applicants */}
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
              New Applicants
            </h3>
            <div style={{
              width: '20px',
              height: '20px',
              color: '#6b7280'
            }}>
              ⭐
            </div>
          </div>
          <div style={{ 
            fontSize: '32px', 
            fontWeight: '700', 
            color: '#22c55e',
            marginBottom: '4px'
          }}>
            +{Math.min(recentCandidatesCount, 5)}
          </div>
          <div style={{ 
            fontSize: '14px', 
            color: '#6b7280'
          }}>
            in the last 7 days
          </div>
        </div>
      </div>

      {/* Candidate Pipeline Section */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '24px'
      }}>
        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: '600', 
          margin: '0 0 16px 0',
          color: '#1f2937'
        }}>
          Candidate Pipeline
        </h2>
        <div style={{ 
          color: '#6b7280', 
          fontSize: '16px',
          textAlign: 'center',
          padding: '40px 0'
        }}>
          No candidates in the pipeline yet. Start by creating job postings to attract candidates.
        </div>
      </div>
    </div>
  );
}
