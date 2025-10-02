

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { showToast } from '../../ui/toast';

export type JobsListResponse = {
  items: Array<{
    id: string;
    title: string;
    slug: string;
    status: 'active' | 'archived';
    tags: string[];
    order: number;
  }>;
  total: number;
  page: number;
  pageSize: number;
};

export function useJob(id: string) {
  return useQuery<Job>({
    queryKey: ['job', id],
    queryFn: async () => {
      const res = await fetch(`/jobs/${id}`);
      if (!res.ok) throw new Error('Failed to fetch job');
      return res.json();
    },
    enabled: !!id,
  });
}

export function useJobs(params: { search?: string; status?: string; page?: number; pageSize?: number; sort?: string; hasAssessment?: boolean }) {
  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search);
  if (params.status) query.set('status', params.status);
  query.set('page', String(params.page ?? 1));
  query.set('pageSize', String(params.pageSize ?? 10));
  if (params.sort) query.set('sort', params.sort);
  if (params.hasAssessment) query.set('hasAssessment', '1');

  return useQuery<JobsListResponse>({
    queryKey: ['jobs', Object.fromEntries(query)],
    queryFn: async () => {
      const res = await fetch(`/jobs?${query.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch jobs');
      return res.json();
    },
  });
}

export function useArchiveJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: string; status: 'active' | 'archived' }) => {
      const res = await fetch(`/jobs/${payload.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: payload.status }),
      });
      if (!res.ok) throw new Error('Failed to update');
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['jobs'] });
      showToast({ title: 'Job updated', variant: 'success' });
    },
    onError: (e: any) => showToast({ title: 'Update failed', description: e?.message, variant: 'error' }),
  });
}

export function useCreateJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { title: string; slug: string; tags: string[] }) => {
      const res = await fetch('/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const msg = await res.json().catch(() => ({}));
        throw new Error(msg.message || 'Failed to create');
      }
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['jobs'] });
      showToast({ title: 'Reordered', variant: 'success' });
    },
    onError: (e: any) => showToast({ title: 'Reorder failed', description: e?.message, variant: 'error' }),
  });
}

export function useUpdateJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: string; title?: string; slug?: string; tags?: string[]; status?: 'active'|'archived' }) => {
      const res = await fetch(`/jobs/${payload.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const msg = await res.json().catch(() => ({}));
        throw new Error(msg.message || 'Failed to update');
      }
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
}

export function useReorderJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: string; fromOrder: number; toOrder: number }) => {
      const res = await fetch(`/jobs/${payload.id}/reorder`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const msg = await res.json().catch(() => ({}));
        throw new Error(msg.message || 'Failed to reorder');
      }
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
}


import type { Job } from './types';


