import { useState } from 'react';
import { useJobs, useArchiveJob, useReorderJob } from './api';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import { JobFormModal } from './JobFormModal';
import { Link } from 'react-router-dom';
import { useHasRole } from '../../app/auth';

export function JobsPage() {
  const canManage = useHasRole('hr');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('');
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('order:asc');
  const pageSize = 10;

  const [hasAssessment, setHasAssessment] = useState(false);
  const { data, isLoading, isError, refetch } = useJobs({ search, status, page, pageSize, sort, hasAssessment });
  const archive = useArchiveJob();
  const reorder = useReorderJob();
  const sensors = useSensors(useSensor(PointerSensor));
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="container">
      <h1 style={{ fontSize: 40, marginBottom: 16 }}>Jobs</h1>
      <div className="row" style={{ marginBottom: 16 }}>
        <input className="input"
          placeholder="Search title or slug"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1 }}
        />
        <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
        <select className="input" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="order:asc">Order ↑</option>
          <option value="order:desc">Order ↓</option>
          <option value="title:asc">Title A-Z</option>
          <option value="title:desc">Title Z-A</option>
          <option value="status:asc">Status ↑</option>
          <option value="status:desc">Status ↓</option>
        </select>
        <label className="row" style={{ gap: 6 }}>
          <input type="checkbox" checked={hasAssessment} onChange={(e) => setHasAssessment(e.target.checked)} />
          <span>Has Assessment</span>
        </label>
        <button className="btn" onClick={() => refetch()}>Apply</button>
      </div>

      {isLoading && <div className="card">Loading jobs…</div>}
      {isError && <div className="card">Failed to load jobs.</div>}

      {data && (
        <>
          {canManage && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
              <button className="btn" onClick={() => setModalOpen(true)}>New Job</button>
            </div>
          )}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={(event) => {
              const { active, over } = event;
              if (!over || active.id === over.id) return;
              const items = data.items.map((j) => j.id);
              const oldIndex = items.indexOf(String(active.id));
              const newIndex = items.indexOf(String(over.id));
              // optimistic reorder: local array move and then call API
              arrayMove(items, oldIndex, newIndex);
              const moved = data.items[oldIndex];
              reorder.mutate({ id: moved.id, fromOrder: oldIndex, toOrder: newIndex }, {
                onError: () => {
                  // best-effort refetch to rollback
                  refetch();
                  alert('Reorder failed, rolled back');
                },
                onSuccess: () => {
                  refetch();
                }
              });
            }}
          >
            <SortableContext items={data.items.map((j) => j.id)} strategy={verticalListSortingStrategy}>
              <table className="table" style={{ tableLayout: 'fixed' }}>
            <colgroup>
              <col style={{ width: '40%' }} />
              <col style={{ width: '20%' }} />
              <col style={{ width: '20%' }} />
              <col style={{ width: '20%' }} />
            </colgroup>
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Tags</th>
                <th>Actions</th>
              </tr>
            </thead>
                <tbody>
              {data.items.map((j) => (
                <SortableItem id={j.id} key={j.id}>
                  <td>{j.title}</td>
                  <td>{j.status}</td>
                  <td>{j.tags.join(', ')}</td>
                  <td>
                    <div className="row" style={{ gap: 6 }} onPointerDown={(e) => e.stopPropagation()}>
                      {canManage && (
                        <Link to={`/jobs/${j.id}`} className="btn secondary" style={{ width: 110, textAlign: 'center' }} draggable={false}>Builder</Link>
                      )}
                      {canManage && (
                        j.status === 'active' ? (
                          <button className="btn" style={{ width: 110 }} onClick={() => archive.mutate({ id: j.id, status: 'archived' })}>Archive</button>
                        ) : (
                          <button className="btn" style={{ width: 110 }} onClick={() => archive.mutate({ id: j.id, status: 'active' })}>Unarchive</button>
                        )
                      )}
                    </div>
                  </td>
                </SortableItem>
              ))}
                </tbody>
              </table>
            </SortableContext>
          </DndContext>

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
      {canManage && <JobFormModal open={modalOpen} onClose={() => setModalOpen(false)} />}
    </div>
  );
}


