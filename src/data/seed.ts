import { db, type JobRecord, type CandidateRecord, type AssessmentRecord, type CandidateTimelineEvent } from './db';

function randomOf<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

export async function ensureSeedData() {
  const jobCount = await db.jobs.count();
  if (jobCount > 0) return; // already seeded

  const jobTitles = [
    'Frontend Engineer', 'Backend Engineer', 'Fullstack Engineer', 'DevOps Engineer', 'Data Scientist',
    'Product Manager', 'QA Engineer', 'Mobile Engineer', 'UI/UX Designer', 'Technical Writer',
    'Security Engineer', 'SRE', 'ML Engineer', 'Support Engineer', 'Engineering Manager',
    'Recruiter', 'HRBP', 'Sales Engineer', 'Solutions Architect', 'Analyst',
    'Finance Ops', 'Marketing Specialist', 'Content Strategist', 'Designer II', 'Platform Engineer',
  ];
  const tags = ['remote', 'hybrid', 'onsite', 'contract', 'full-time'];

  const jobs: JobRecord[] = jobTitles.map((title, index) => ({
    id: crypto.randomUUID(),
    title,
    slug: slugify(title) + '-' + (index + 1),
    status: Math.random() < 0.2 ? 'archived' : 'active',
    tags: [randomOf(tags)],
    order: index,
  }));

  await db.jobs.bulkAdd(jobs);

  const stages: CandidateRecord['stage'][] = ['applied', 'screen', 'tech', 'offer', 'hired', 'rejected'];

  const candidates: CandidateRecord[] = Array.from({ length: 1000 }).map((_, i) => {
    const job = randomOf(jobs);
    const name = `Candidate ${i + 1}`;
    const email = `candidate${i + 1}@example.com`;
    return {
      id: crypto.randomUUID(),
      jobId: job.id,
      name,
      email,
      stage: randomOf(stages),
    };
  });

  await db.candidates.bulkAdd(candidates);

  const timeline: CandidateTimelineEvent[] = candidates.slice(0, 200).flatMap((c) => {
    const changes = Math.floor(Math.random() * 3) + 1;
    return Array.from({ length: changes }).map(() => ({
      id: crypto.randomUUID(),
      candidateId: c.id,
      type: 'stage_change',
      timestamp: Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 30),
      payload: { to: randomOf(stages) },
    }));
  });
  await db.timelines.bulkAdd(timeline);

  const assessments: AssessmentRecord[] = jobs.slice(0, 3).map((j) => ({
    jobId: j.id,
    schema: {
      title: `${j.title} Assessment`,
      sections: [
        {
          id: crypto.randomUUID(),
          title: 'General',
          questions: Array.from({ length: 10 }).map(() => ({
            id: crypto.randomUUID(),
            type: randomOf(['single', 'multi', 'short', 'long', 'number', 'file']),
            label: 'Question',
            required: Math.random() < 0.6,
          })),
        },
      ],
    },
  }));
  await db.assessments.bulkAdd(assessments);
}


