import { useState } from 'react';
import { useCandidates } from './api';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { KanbanBoard } from './KanbanBoard';

export function CandidatesPage() {
  const [search, setSearch] = useState('');
  const [stage, setStage] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 100;
  const { data, isLoading, isError, refetch } = useCandidates({ search, stage, page, pageSize });

  const parentRef = useRef<HTMLDivElement | null>(null);
  const rowVirtualizer = useVirtualizer({
    count: data?.items.length ?? 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48,
    overscan: 10,
  });

  const [view, setView] = useState<'list'|'board'>('list');

  return (
    <div className="container">
      <h1 style={{ fontSize: 40, marginBottom: 16 }}>Candidates</h1>
      <div style={{ marginBottom: 8 }}>
        <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span>View:</span>
          <select value={view} onChange={(e) => setView(e.target.value as any)}>
            <option value="list">List</option>
            <option value="board">Kanban</option>
          </select>
        </label>
      </div>
      <div className="row" style={{ marginBottom: 16 }}>
        <input className="input" placeholder="Search name/email" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="input" value={stage} onChange={(e) => setStage(e.target.value)}>
          <option value="">All stages</option>
          <option value="applied">Applied</option>
          <option value="screen">Screen</option>
          <option value="tech">Tech</option>
          <option value="offer">Offer</option>
          <option value="hired">Hired</option>
          <option value="rejected">Rejected</option>
        </select>
        <button className="btn" onClick={() => refetch()}>Apply</button>
      </div>

      {isLoading && <div className="card">Loading candidates…</div>}
      {isError && <div className="card">Failed to load candidates.</div>}

      {view === 'list' && data && (
        <>
          <div
            ref={parentRef}
            style={{ height: 520, overflow: 'auto', border: '1px solid #333', borderRadius: 10 }}
          >
            <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: 'relative' }}>
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const item = data.items[virtualRow.index];
                return (
                  <div
                    key={item.id}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      transform: `translateY(${virtualRow.start}px)`,
                      padding: 8,
                      borderBottom: '1px solid #333',
                      display: 'flex',
                      gap: 8,
                      alignItems: 'center',
                    }}
                  >
                    <div style={{ width: 240 }}>
                      <Link to={`/candidates/${item.id}`}>{item.name}</Link>
                    </div>
                    <div style={{ width: 280 }}>{item.email}</div>
                    <div style={{ width: 120 }}>{item.stage}</div>
                  </div>
                );
              })}
            </div>
          </div>
          {data.items.length === 0 && <div className="card" style={{ marginTop: 12 }}>No candidates found.</div>}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 16 }}>
            <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
            <span>
              Page {data.page} of {Math.max(1, Math.ceil(data.total / data.pageSize))}
            </span>
            <button
              disabled={data.page * data.pageSize >= data.total}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}

      {view === 'board' && (
        <KanbanBoard />
      )}
    </div>
  );
}


