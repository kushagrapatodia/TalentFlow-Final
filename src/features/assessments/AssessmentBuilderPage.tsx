import { useState } from 'react';
import { useJobs } from '../jobs/api';
import { Link } from 'react-router-dom';

export function AssessmentBuilderPage() {
  const [search, setSearch] = useState('');
  const { data, isLoading, isError } = useJobs({ 
    search, 
    status: 'active', 
    page: 1, 
    pageSize: 50, 
    sort: 'title:asc',
    hasAssessment: false // Show all jobs, not just those with assessments
  });

  return (
    <div className="container" style={{ color: '#1f2937' }}>
      <h1 style={{ fontSize: 40, marginBottom: 16 }}>Assessment Builder</h1>
      <p style={{ color: '#6b7280', marginBottom: 24 }}>
        Create and manage assessments for your job postings. Click on a job to build its assessment.
      </p>

      <div className="row" style={{ marginBottom: 16 }}>
        <input 
          className="input"
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1 }}
        />
      </div>

      {isLoading && <div className="card">Loading jobs…</div>}
      {isError && <div className="card">Failed to load jobs.</div>}

      {data && (
        <>
          {data.items.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
              <h3>No jobs found</h3>
              <p>Create some job postings first, then come back to build assessments for them.</p>
              <Link to="/jobs" className="btn" style={{ marginTop: '16px' }}>
                Go to Jobs
              </Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '16px' }}>
              {data.items.map((job) => (
                <div key={job.id} className="card" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ margin: '0 0 8px 0', fontSize: '20px' }}>
                        {job.title}
                      </h3>
                      <p style={{ margin: '0 0 8px 0', color: '#6b7280' }}>
                        {job.slug}
                      </p>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {job.tags.map((tag) => (
                          <span 
                            key={tag}
                            style={{
                              background: '#f3f4f6',
                              color: '#374151',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '12px'
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <span style={{ 
                        color: job.status === 'active' ? '#22c55e' : '#6b7280',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}>
                        {job.status}
                      </span>
                      <Link 
                        to={`/jobs/${job.id}`}
                        style={{
                          backgroundColor: '#22c55e',
                          color: 'white',
                          padding: '8px 16px',
                          borderRadius: '6px',
                          textDecoration: 'none',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}
                      >
                        Build Assessment
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
