import { DndContext, closestCorners, useDroppable, useDraggable } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { useCandidates, useUpdateCandidateStage } from './api';

const STAGES: Array<{ id: any; title: string }> = [
  { id: 'applied', title: 'Applied' },
  { id: 'screen', title: 'Screen' },
  { id: 'tech', title: 'Tech' },
  { id: 'offer', title: 'Offer' },
  { id: 'hired', title: 'Hired' },
  { id: 'rejected', title: 'Rejected' },
];

export function KanbanBoard() {
  const { data, refetch } = useCandidates({ page: 1, pageSize: 1000 });
  const move = useUpdateCandidateStage();

  const byStage = new Map<string, any[]>();
  STAGES.forEach((s) => byStage.set(s.id, []));
  data?.items.forEach((c) => {
    byStage.get(c.stage)?.push(c);
  });

  function onDragEnd(e: DragEndEvent) {
    const dest = (e.over?.id as string) || '';
    const id = String(e.active.id);
    const candidate = data?.items.find((c) => c.id === id);
    if (!candidate || !STAGES.some((s) => s.id === dest) || dest === candidate.stage) return;
    move.mutate({ id, stage: dest as any }, {
      onError: () => {
        refetch();
        alert('Move failed');
      },
      onSuccess: () => refetch(),
    });
  }

  return (
    <DndContext collisionDetection={closestCorners} onDragEnd={onDragEnd}>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: `repeat(${STAGES.length}, 1fr)`, 
        gap: '16px',
        padding: '16px',
        overflowX: 'auto',
        minWidth: '100%'
      }}>
        {STAGES.map((col) => (
          <DroppableColumn 
            key={col.id} 
            id={String(col.id)} 
            title={col.title}
            count={(byStage.get(String(col.id)) || []).length}
          >
            {(byStage.get(String(col.id)) || []).map((c) => (
              <DraggableCard 
                key={c.id} 
                id={c.id} 
                label={c.name} 
                email={c.email}
              />
            ))}
          </DroppableColumn>
        ))}
      </div>
    </DndContext>
  );
}

function DroppableColumn({ id, title, children, count }: { id: string; title: string; children: React.ReactNode; count: number }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div ref={setNodeRef} style={{ 
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      minHeight: 400,
      padding: '16px',
      background: isOver ? '#f3f4f6' : '#ffffff',
      boxShadow: isOver ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
      transition: 'all 0.2s ease',
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '16px',
        paddingBottom: '12px',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <h3 style={{ 
          margin: 0,
          fontSize: '16px',
          fontWeight: 600,
          color: '#1f2937'
        }}>{title}</h3>
        <span style={{
          backgroundColor: '#f3f4f6',
          color: '#6b7280',
          padding: '2px 8px',
          borderRadius: '12px',
          fontSize: '14px'
        }}>{count}</span>
      </div>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>{children}</div>
    </div>
  );
}

function DraggableCard({ id, label, email }: { id: string; label: string; email: string }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });
  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition: 'transform 0.2s ease',
    opacity: isDragging ? 0.7 : 1,
    cursor: 'grab',
    padding: '12px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    background: '#ffffff',
    boxShadow: isDragging ? '0 8px 16px rgba(0,0,0,0.1)' : '0 2px 4px rgba(0,0,0,0.05)',
    userSelect: 'none',
  } as const;
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div style={{ 
        fontSize: '14px',
        fontWeight: 500,
        color: '#1f2937',
        marginBottom: '4px'
      }}>{label}</div>
      <div style={{ 
        fontSize: '12px',
        color: '#6b7280'
      }}>{email}</div>
    </div>
  );
}


