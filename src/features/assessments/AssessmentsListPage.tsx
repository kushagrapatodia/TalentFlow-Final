import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../app/auth';

type Item = { jobId: string; title: string };

export function AssessmentsListPage() {
  const { candidateId } = useAuth();
  const { data, isLoading, isError } = useQuery<{ items: Item[] }>({
    queryKey: ['assessments', 'available', candidateId],
    queryFn: async () => {
      const res = await fetch(`/assessments?candidateId=${encodeURIComponent(candidateId || '')}`);
      if (!res.ok) throw new Error('Failed to load');
      return res.json();
    },
  });

  return (
    <div className="container">
      <h1 style={{ fontSize: 36, marginBottom: 12 }}>Assessments</h1>
      {isLoading && <div className="card">Loading…</div>}
      {isError && <div className="card">Failed to load.</div>}
      <div className="col" style={{ gap: 12 }}>
        {data?.items?.map((a) => (
          <div key={a.jobId} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <strong>{a.title}</strong>
              <div style={{ opacity: .8, fontSize: 12 }}>Job ID: {a.jobId}</div>
            </div>
            <Link to={`/assessments/${a.jobId}/take`} className="btn">Take</Link>
          </div>
        ))}
      </div>
    </div>
  );
}


