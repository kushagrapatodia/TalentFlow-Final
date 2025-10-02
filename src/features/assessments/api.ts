
function getApiBase(path: string) {
  if (import.meta.env.MODE === 'production') {
    if (path.startsWith('/assessments')) return '/api' + path;
    if (path.startsWith('/jobs')) return '/api' + path;
    if (path.startsWith('/candidates')) return '/api' + path;
  }
  return path;
}
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { showToast } from '../../ui/toast';

export function useAssessment(jobId: string) {
  return useQuery<{ jobId: string; schema: any }>({
    queryKey: ['assessment', jobId],
    queryFn: async () => {
  const res = await fetch(getApiBase(`/assessments/${jobId}`));
      if (!res.ok) throw new Error('Failed to load assessment');
      return res.json();
    },
    enabled: !!jobId,
  });
}

export function useSaveAssessment(jobId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (schema: any) => {
  const res = await fetch(getApiBase(`/assessments/${jobId}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, schema }),
      });
      if (!res.ok) throw new Error('Failed to save assessment');
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['assessment', jobId] });
      showToast({ title: 'Assessment saved', variant: 'success' });
    },
    onError: (e: any) => showToast({ title: 'Save failed', description: e?.message, variant: 'error' }),
  });
}

export function useSubmitAssessment(jobId: string) {
  return useMutation({
    mutationFn: async (payload: { candidateId: string; responses: any }) => {
  const res = await fetch(getApiBase(`/assessments/${jobId}/submit`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to submit');
      return res.json();
    },
    onSuccess: () => showToast({ title: 'Submission stored', variant: 'success' }),
    onError: (e: any) => showToast({ title: 'Submit failed', description: e?.message, variant: 'error' }),
  });
}

export function useAssignments(jobId: string) {
  return useQuery<{ items: Array<{ id: string; jobId: string; candidateId: string }> }>({
    queryKey: ['assignments', jobId],
    queryFn: async () => {
  const res = await fetch(getApiBase(`/assessments/${jobId}/assignments`));
      if (!res.ok) throw new Error('Failed to load assignments');
      return res.json();
    },
    enabled: !!jobId,
  });
}

export function useAssignCandidate(jobId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { candidateId: string }) => {
  const res = await fetch(getApiBase(`/assessments/${jobId}/assignments`), {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to assign');
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['assignments', jobId] }),
  });
}

export function useUnassignCandidate(jobId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (candidateId: string) => {
  const res = await fetch(getApiBase(`/assessments/${jobId}/assignments/${candidateId}`), { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to unassign');
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['assignments', jobId] }),
  });
}


