import { http, HttpResponse, delay } from 'msw';
import { db, type JobRecord, type AssessmentRecord, type AssessmentSubmission, type AssessmentAssignment } from '../data/db';

const API_DELAY_MIN = 200;
const API_DELAY_MAX = 1200;

function shouldFail(prob = 0.08): boolean {
  return Math.random() < prob; // ~8% by default
}

function randomDelay() {
  return Math.floor(Math.random() * (API_DELAY_MAX - API_DELAY_MIN + 1)) + API_DELAY_MIN;
}

function parseNumber(value: string | null | undefined, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export const handlers = [
  // Health
  http.get('/health', async () => {
    await delay(randomDelay());
    return HttpResponse.json({ ok: true });
  }),

  // GET /jobs?search=&status=&page=&pageSize=&sort=&hasAssessment=
  http.get('/jobs', async ({ request }) => {
    const url = new URL(request.url);
    const search = (url.searchParams.get('search') || '').toLowerCase();
    const status = url.searchParams.get('status'); // active|archived|all|empty
    const page = parseNumber(url.searchParams.get('page'), 1);
    const pageSize = parseNumber(url.searchParams.get('pageSize'), 10);
    const sort = url.searchParams.get('sort') || 'order:asc';
    const hasAssessment = url.searchParams.get('hasAssessment') === '1';

    await delay(randomDelay());

    let collection = await db.jobs.toArray();
    if (search) {
      collection = collection.filter((j) => j.title.toLowerCase().includes(search) || j.slug.includes(search));
    }
    if (status === 'active' || status === 'archived') {
      collection = collection.filter((j) => j.status === status);
    }
    if (hasAssessment) {
      const all = await db.assessments.toArray();
      const set = new Set(all.map((a) => a.jobId));
      collection = collection.filter((j) => set.has(j.id));
    }

    // sorting
    const [sortField, sortDir] = (sort || 'order:asc').split(':');
    const dir = sortDir === 'desc' ? -1 : 1;
    collection.sort((a: any, b: any) => {
      if (sortField === 'title') return a.title.localeCompare(b.title) * dir;
      if (sortField === 'status') return a.status.localeCompare(b.status) * dir;
      return (a.order - b.order) * dir;
    });

    const total = collection.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const items = collection.slice(start, end);

    return HttpResponse.json({ items, total, page, pageSize });
  }),

  // GET /candidates?search=&stage=&page=
  http.get('/candidates', async ({ request }) => {
    const url = new URL(request.url);
    const search = (url.searchParams.get('search') || '').toLowerCase();
    const stage = url.searchParams.get('stage');
    const page = parseNumber(url.searchParams.get('page'), 1);
    const pageSize = parseNumber(url.searchParams.get('pageSize'), 50);

    await delay(randomDelay());

    let collection = await db.candidates.toArray();
    if (search) {
      collection = collection.filter((c) => c.name.toLowerCase().includes(search) || c.email.toLowerCase().includes(search));
    }
    if (stage) {
      collection = collection.filter((c) => c.stage === stage);
    }

    const total = collection.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const items = collection.slice(start, end);
    return HttpResponse.json({ items, total, page, pageSize });
  }),

  // GET /candidates/:id/timeline
  http.get('/candidates/:id/timeline', async ({ params }) => {
    await delay(randomDelay());
    const candidateId = String(params.id);
    const items = await db.timelines.where('candidateId').equals(candidateId).toArray();
    items.sort((a, b) => a.timestamp - b.timestamp);
    return HttpResponse.json({ items });
  }),

  // PATCH /candidates/:id (stage transitions)
  http.patch('/candidates/:id', async ({ params, request }) => {
    await delay(randomDelay());
    if (shouldFail(0.08)) {
      return HttpResponse.json({ message: 'Random failure' }, { status: 500 });
    }
    const id = String(params.id);
    const body = (await request.json()) as { stage?: string };
    const existing = await db.candidates.get(id);
    if (!existing) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    const next = { ...existing, ...body } as any;
    await db.candidates.put(next);
    if (body.stage && body.stage !== existing.stage) {
      await db.timelines.add({
        id: crypto.randomUUID(),
        candidateId: id,
        type: 'stage_change',
        timestamp: Date.now(),
        payload: { from: existing.stage, to: body.stage },
      } as any);
    }
    return HttpResponse.json(next);
  }),

  // POST /jobs
  http.post('/jobs', async ({ request }) => {
    await delay(randomDelay());
    if (shouldFail(0.08)) {
      return HttpResponse.json({ message: 'Random failure' }, { status: 500 });
    }
    const body = (await request.json()) as Partial<JobRecord>;
    const id = crypto.randomUUID();
    const nextOrder = (await db.jobs.count());
    if (body.slug) {
      const exists = await db.jobs.where('slug').equals(body.slug).count();
      if (exists > 0) return HttpResponse.json({ message: 'Slug already exists' }, { status: 409 });
    }
    const record: JobRecord = {
      id,
      title: body.title || 'Untitled',
      slug: body.slug || `job-${id.slice(0, 8)}`,
      status: 'active',
      tags: Array.isArray(body.tags) ? body.tags : [],
      order: nextOrder,
    };
    await db.jobs.add(record);
    return HttpResponse.json(record, { status: 201 });
  }),

  // PATCH /jobs/:id
  http.patch('/jobs/:id', async ({ params, request }) => {
    await delay(randomDelay());
    if (shouldFail(0.08)) {
      return HttpResponse.json({ message: 'Random failure' }, { status: 500 });
    }
    const id = String(params.id);
    const body = (await request.json()) as Partial<JobRecord>;
    const existing = await db.jobs.get(id);
    if (!existing) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    if (body.slug && body.slug !== existing.slug) {
      const exists = await db.jobs.where('slug').equals(body.slug).count();
      if (exists > 0) return HttpResponse.json({ message: 'Slug already exists' }, { status: 409 });
    }
    const next = { ...existing, ...body } as JobRecord;
    await db.jobs.put(next);
    return HttpResponse.json(next);
  }),

  // PATCH /jobs/:id/reorder
  http.patch('/jobs/:id/reorder', async ({ params, request }) => {
    await delay(randomDelay());
    // Slightly higher failure to test rollback
    if (shouldFail(0.15)) {
      return HttpResponse.json({ message: 'Reorder failed' }, { status: 500 });
    }
    const id = String(params.id);
    const { fromOrder, toOrder } = (await request.json()) as { fromOrder: number; toOrder: number };
    const jobs = await db.jobs.toArray();
    jobs.sort((a, b) => a.order - b.order);
    const moving = jobs.find((j) => j.id === id);
    if (!moving) return HttpResponse.json({ message: 'Not found' }, { status: 404 });

    // Recalculate orders
    const without = jobs.filter((j) => j.id !== id);
    without.splice(toOrder, 0, moving);
    await db.transaction('rw', db.jobs, async () => {
      await Promise.all(
        without.map((j, idx) => db.jobs.update(j.id, { order: idx }))
      );
    });
    return HttpResponse.json({ ok: true });
  }),

  // Assessments
  // GET /assessments/:jobId
  http.get('/assessments/:jobId', async ({ params }) => {
    await delay(randomDelay());
    const jobId = String(params.jobId);
    const rec = await db.assessments.get(jobId);
    if (!rec) {
      // initialize with default template if not present
      const template = {
        title: 'Screening Assessment',
        sections: [
          {
            id: crypto.randomUUID(),
            title: 'General',
            questions: [
              { id: crypto.randomUUID(), type: 'short', label: 'Full Name', required: true },
              { id: crypto.randomUUID(), type: 'short', label: 'Email', required: true },
              { id: crypto.randomUUID(), type: 'number', label: 'Years of Experience', required: true, min: 0, max: 50 },
              { id: crypto.randomUUID(), type: 'single', label: 'Willing to relocate?', required: true },
            ],
          },
        ],
      } as any;
      const initial: AssessmentRecord = { jobId, schema: template };
      await db.assessments.put(initial);
      return HttpResponse.json(initial);
    }
    return HttpResponse.json(rec);
  }),

  // GET /assessments (list available) - filter by candidateId if provided
  http.get('/assessments', async ({ request }) => {
    await delay(randomDelay());
    const url = new URL(request.url);
    const candidateId = url.searchParams.get('candidateId');
    let col = await db.assessments.toArray();
    if (candidateId) {
      const assigned = await db.assignments.where('candidateId').equals(candidateId).toArray();
      const set = new Set(assigned.map((a) => a.jobId));
      col = col.filter((a) => set.has(a.jobId));
    }
    const items = col.map((a) => ({ jobId: a.jobId, title: (a.schema as any)?.title || 'Assessment' }));
    return HttpResponse.json({ items });
  }),

  // PUT /assessments/:jobId
  http.put('/assessments/:jobId', async ({ params, request }) => {
    await delay(randomDelay());
    if (shouldFail(0.08)) return HttpResponse.json({ message: 'Save failed' }, { status: 500 });
    const jobId = String(params.jobId);
    const body = (await request.json()) as AssessmentRecord;
    await db.assessments.put({ jobId, schema: body.schema });
    return HttpResponse.json({ ok: true });
  }),

  // POST /assessments/:jobId/submit
  http.post('/assessments/:jobId/submit', async ({ params, request }) => {
    await delay(randomDelay());
    if (shouldFail(0.08)) return HttpResponse.json({ message: 'Submit failed' }, { status: 500 });
    const jobId = String(params.jobId);
    const body = (await request.json()) as { candidateId: string; responses: unknown };
    const sub: AssessmentSubmission = {
      id: crypto.randomUUID(),
      jobId,
      candidateId: body.candidateId,
      responses: body.responses,
      submittedAt: Date.now(),
    };
    await db.submissions.add(sub);
    return HttpResponse.json({ ok: true, id: sub.id }, { status: 201 });
  }),

  // GET /assessments/:jobId/assignments
  http.get('/assessments/:jobId/assignments', async ({ params }) => {
    await delay(randomDelay());
    const jobId = String(params.jobId);
    const items = await db.assignments.where('jobId').equals(jobId).toArray();
    return HttpResponse.json({ items });
  }),

  // POST /assessments/:jobId/assignments
  http.post('/assessments/:jobId/assignments', async ({ params, request }) => {
    await delay(randomDelay());
    const jobId = String(params.jobId);
    const body = (await request.json()) as { candidateId: string };
    const id = `${jobId}:${body.candidateId}`;
    const rec: AssessmentAssignment = { id, jobId, candidateId: body.candidateId };
    await db.assignments.put(rec);
    return HttpResponse.json(rec, { status: 201 });
  }),

  // DELETE /assessments/:jobId/assignments/:candidateId
  http.delete('/assessments/:jobId/assignments/:candidateId', async ({ params }) => {
    await delay(randomDelay());
    const jobId = String(params.jobId);
    const candidateId = String(params.candidateId);
    const id = `${jobId}:${candidateId}`;
    await db.assignments.delete(id);
    return HttpResponse.json({ ok: true });
  }),
];


