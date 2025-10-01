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
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${STAGES.length}, 1fr)`, gap: 12, padding: 12 }}>
        {STAGES.map((col) => (
          <DroppableColumn key={col.id} id={String(col.id)} title={col.title}>
            {(byStage.get(String(col.id)) || []).map((c) => (
              <DraggableCard key={c.id} id={c.id} label={c.name} />
            ))}
          </DroppableColumn>
        ))}
      </div>
    </DndContext>
  );
}

function DroppableColumn({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div ref={setNodeRef} style={{ border: '1px solid #444', minHeight: 300, padding: 8, background: isOver ? 'rgba(255,255,255,0.05)' : 'transparent' }}>
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      <div>{children}</div>
    </div>
  );
}

function DraggableCard({ id, label }: { id: string; label: string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useDraggable({ id });
  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    opacity: isDragging ? 0.7 : 1,
    cursor: 'grab',
    padding: 8,
    border: '1px solid #555',
    marginBottom: 8,
    borderRadius: 6,
    background: '#111',
  } as const;
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {label}
    </div>
  );
}


