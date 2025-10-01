import { useParams } from 'react-router-dom';
import { useCandidateTimeline } from './api';

export function CandidateProfilePage() {
  const { id = '' } = useParams();
  const { data, isLoading, isError } = useCandidateTimeline(id);

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 36 }}>Candidate Profile</h1>
      {isLoading && <p>Loading…</p>}
      {isError && <p>Failed to load timeline.</p>}
      {data && (
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {data.items.length === 0 && <p>No events yet.</p>}
          {data.items.map((e) => (
            <div key={e.id} style={{ padding: 8, border: '1px solid #444', borderRadius: 6 }}>
              <div style={{ fontSize: 12, opacity: 0.7 }}>{new Date(e.timestamp).toLocaleString()}</div>
              <div>{e.type === 'stage_change' ? `Stage → ${e.payload?.to ?? '?'}` : 'Note'}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


