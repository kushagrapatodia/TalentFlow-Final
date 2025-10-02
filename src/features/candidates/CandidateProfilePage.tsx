import { useParams } from 'react-router-dom';
import { useCandidate, useCandidateTimeline, useCandidateNotes } from './api';
import { useJobs } from '../jobs/api';
import { CandidateNotesSection } from './CandidateNotesSection';
import { useAuth } from '../../app/auth';

export function CandidateProfilePage() {
  const { id = '' } = useParams();
  const { role } = useAuth();
  const { data: candidate, isLoading: candidateLoading, isError: candidateError } = useCandidate(id);
  const { data: timeline, isLoading: timelineLoading, isError: timelineError } = useCandidateTimeline(id);
  const { data: notes, isLoading: notesLoading } = useCandidateNotes(id);
  const { data: jobsData } = useJobs({ page: 1, pageSize: 100 });
  
  // Find the job this candidate applied for
  const candidateJob = jobsData?.items?.find(job => job.id === candidate?.jobId);

  return (
    <div style={{ 
      padding: '24px',
      color: '#1f2937',
      backgroundColor: '#f9fafb',
      minHeight: '100vh'
    }}>
      <h1 style={{ 
        fontSize: '32px',
        fontWeight: '700',
        margin: '0 0 24px 0',
        color: '#1f2937'
      }}>
        {candidate?.name || 'Candidate Profile'}
      </h1>
      
      {(candidateLoading || timelineLoading || notesLoading) && (
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '24px',
          textAlign: 'center'
        }}>
          Loading candidate details…
        </div>
      )}
      
      {(candidateError || timelineError) && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          padding: '24px',
          color: '#dc2626'
        }}>
          Failed to load candidate information.
        </div>
      )}
      
      {candidate && (
        <>
          {/* Candidate Details Card */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <h2 style={{ 
              fontSize: '20px',
              fontWeight: '600',
              margin: '0 0 16px 0',
              color: '#1f2937'
            }}>
              Candidate Information
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ 
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#6b7280',
                  marginBottom: '4px'
                }}>
                  Name
                </label>
                <div style={{ fontSize: '16px', color: '#1f2937' }}>
                  {candidate.name}
                </div>
              </div>
              
              <div>
                <label style={{ 
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#6b7280',
                  marginBottom: '4px'
                }}>
                  Email
                </label>
                <div style={{ fontSize: '16px', color: '#1f2937' }}>
                  {candidate.email}
                </div>
              </div>
              
              <div>
                <label style={{ 
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#6b7280',
                  marginBottom: '4px'
                }}>
                  Current Stage
                </label>
                <div style={{ 
                  fontSize: '14px',
                  fontWeight: '500',
                  padding: '4px 12px',
                  borderRadius: '6px',
                  display: 'inline-block',
                  backgroundColor: candidate.stage === 'hired' ? '#dcfce7' : 
                                  candidate.stage === 'rejected' ? '#fef2f2' :
                                  candidate.stage === 'offer' ? '#fef3c7' : '#e0f2fe',
                  color: candidate.stage === 'hired' ? '#166534' : 
                         candidate.stage === 'rejected' ? '#dc2626' :
                         candidate.stage === 'offer' ? '#d97706' : '#0369a1'
                }}>
                  {candidate.stage.charAt(0).toUpperCase() + candidate.stage.slice(1)}
                </div>
              </div>
              
              <div>
                <label style={{ 
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#6b7280',
                  marginBottom: '4px'
                }}>
                  Applied For
                </label>
                <div style={{ fontSize: '16px', color: '#1f2937' }}>
                  {candidateJob?.title || 'Loading...'}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      
      {timeline && (
        <div>
          <h2 style={{ 
            fontSize: '20px',
            fontWeight: '600',
            margin: '0 0 16px 0',
            color: '#1f2937'
          }}>
            Timeline
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {timeline.items.length === 0 ? (
              <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '32px',
                textAlign: 'center',
                color: '#6b7280'
              }}>
                No timeline events yet for this candidate.
              </div>
            ) : (
              timeline.items.map((e) => (
                <div key={e.id} style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '16px'
                }}>
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#6b7280',
                    marginBottom: '4px'
                  }}>
                    {new Date(e.timestamp).toLocaleString()}
                  </div>
                  <div style={{ 
                    fontSize: '14px',
                    color: '#1f2937',
                    fontWeight: '500'
                  }}>
                    {e.type === 'stage_change' 
                      ? `Stage changed to ${e.payload?.to ?? 'Unknown'}` 
                      : 'Note added'
                    }
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Notes Section - Only for HR users */}
      {role === 'hr' && notes && (
        <CandidateNotesSection 
          candidateId={id} 
          notes={notes.items} 
        />
      )}
    </div>
  );
}


