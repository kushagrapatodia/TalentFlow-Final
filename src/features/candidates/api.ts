import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { showToast } from '../../ui/toast';

export type Candidate = {
  id: string;
  jobId: string;
  name: string;
  email: string;
  stage: 'applied'|'screen'|'tech'|'offer'|'hired'|'rejected';
};

export function useCandidates(params: { search?: string; stage?: string; page?: number; pageSize?: number }) {
  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search);
  if (params.stage) query.set('stage', params.stage);
  query.set('page', String(params.page ?? 1));
  query.set('pageSize', String(params.pageSize ?? 50));
  return useQuery<{ items: Candidate[]; total: number; page: number; pageSize: number }>({
    queryKey: ['candidates', Object.fromEntries(query)],
    queryFn: async () => {
      const res = await fetch(`/candidates?${query.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch candidates');
      return res.json();
    },
  });
}

export function useCandidate(id: string) {
  return useQuery<Candidate>({
    queryKey: ['candidate', id],
    queryFn: async () => {
      const res = await fetch(`/candidates/${id}`);
      if (!res.ok) throw new Error('Failed to fetch candidate');
      return res.json();
    },
    enabled: !!id,
  });
}

export function useAddCandidateNote(candidateId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (note: { content: string; mentions: string[] }) => {
      const res = await fetch(`/candidates/${candidateId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(note)
      });
      if (!res.ok) throw new Error('Failed to add note');
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['candidate', candidateId] });
      qc.invalidateQueries({ queryKey: ['candidate-notes', candidateId] });
  showToast({ title: 'Note added successfully!' });
    },
    onError: () => {
  showToast({ title: 'Failed to add note' });
    }
  });
}

export function useCandidateNotes(candidateId: string) {
  return useQuery<{ items: Array<{
    id: string;
    content: string;
    author: string;
    timestamp: number;
    mentions: string[];
  }> }>({
    queryKey: ['candidate-notes', candidateId],
    queryFn: async () => {
      const res = await fetch(`/candidates/${candidateId}/notes`);
      if (!res.ok) throw new Error('Failed to fetch notes');
      return res.json();
    },
    enabled: !!candidateId,
  });
}

export function useCandidateTimeline(id: string) {
  return useQuery<{ items: Array<{ id: string; timestamp: number; type: string; payload: any }> }>({
    queryKey: ['candidate', id, 'timeline'],
    queryFn: async () => {
      const res = await fetch(`/candidates/${id}/timeline`);
      if (!res.ok) throw new Error('Failed to fetch timeline');
      return res.json();
    },
    enabled: !!id,
  });
}

export function useUpdateCandidateStage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: string; stage: Candidate['stage'] }) => {
      const res = await fetch(`/candidates/${payload.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: payload.stage }),
      });
      if (!res.ok) throw new Error('Failed to move candidate');
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['candidates'] });
      showToast({ title: 'Stage updated', variant: 'success' });
    },
    onError: (e: any) => showToast({ title: 'Move failed', description: e?.message, variant: 'error' }),
  });
}


