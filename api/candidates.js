export default function handler(req, res) {
  const candidates = [
    {
      id: '1',
      jobId: '1',
      name: 'Alice Smith',
      email: 'alice@example.com',
      stage: 'applied'
    },
    {
      id: '2',
      jobId: '2',
      name: 'Bob Johnson',
      email: 'bob@example.com',
      stage: 'screen'
    }
  ];
    const { url, method } = req;
    const idMatch = url.match(/^\/api\/candidates\/(\w+)/);
    const notesMatch = url.match(/^\/api\/candidates\/(\w+)\/notes/);
    const timelineMatch = url.match(/^\/api\/candidates\/(\w+)\/timeline/);

    if (idMatch && !notesMatch && !timelineMatch && method === 'GET') {
      const candidate = candidates.find(c => c.id === idMatch[1]);
      if (candidate) return res.status(200).json(candidate);
      return res.status(404).json({ error: 'Candidate not found' });
    }

    if (notesMatch && method === 'GET') {
      // Return mock notes
      return res.status(200).json({ items: [
        {
          id: 'note1',
          content: 'Great interview performance.',
          author: 'Sarah Wilson',
          timestamp: Date.now() - 86400000,
          mentions: ['John Doe']
        }
      ] });
    }

    if (timelineMatch && method === 'GET') {
      // Return mock timeline
      return res.status(200).json({ items: [
        {
          id: 'timeline1',
          candidateId: timelineMatch[1],
          type: 'stage_change',
          timestamp: Date.now() - 86400000,
          payload: { to: 'screen' }
        }
      ] });
    }

    // List endpoint
    res.status(200).json({ items: candidates, total: candidates.length, page: 1, pageSize: 100 });
}
