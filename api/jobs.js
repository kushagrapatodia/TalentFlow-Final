export default function handler(req, res) {
  const jobs = [
    { id: '1', title: 'Frontend Engineer', slug: 'frontend-engineer-1', status: 'active', tags: ['remote'], order: 0 },
    { id: '2', title: 'Backend Engineer', slug: 'backend-engineer-2', status: 'active', tags: ['onsite'], order: 1 },
    { id: '3', title: 'Fullstack Engineer', slug: 'fullstack-engineer-3', status: 'active', tags: ['hybrid'], order: 2 }
  ];
  const { url, method } = req;
  const idMatch = url.match(/^\/api\/jobs\/(\w+)/);

  if (idMatch && method === 'GET') {
    const job = jobs.find(j => j.id === idMatch[1]);
    if (job) return res.status(200).json(job);
    return res.status(404).json({ error: 'Job not found' });
  }

  // List endpoint
  res.status(200).json({ items: jobs, total: jobs.length, page: 1, pageSize: 100 });
}
