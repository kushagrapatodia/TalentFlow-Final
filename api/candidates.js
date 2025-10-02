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
  res.status(200).json({ items: candidates, total: candidates.length, page: 1, pageSize: 100 });
}
