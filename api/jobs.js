export default function handler(req, res) {
  const jobs = [
    {
      id: '1',
      title: 'Frontend Engineer',
      slug: 'frontend-engineer-1',
      status: 'active',
      tags: ['remote'],
      order: 0
    },
    {
      id: '2',
      title: 'Backend Engineer',
      slug: 'backend-engineer-2',
      status: 'active',
      tags: ['onsite'],
      order: 1
    }
  ];
  res.status(200).json({ items: jobs, total: jobs.length, page: 1, pageSize: 100 });
}
