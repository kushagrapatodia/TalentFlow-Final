import Dexie from 'dexie';
import type { Table } from 'dexie';

export type JobRecord = {
  id: string;
  title: string;
  slug: string;
  status: 'active' | 'archived';
  tags: string[];
  order: number;
};

export type CandidateRecord = {
  id: string;
  jobId: string;
  name: string;
  email: string;
  stage: 'applied' | 'screen' | 'tech' | 'offer' | 'hired' | 'rejected';
};

export type CandidateTimelineEvent = {
  id: string;
  candidateId: string;
  type: 'stage_change' | 'note';
  timestamp: number;
  payload: any;
};

export type AssessmentRecord = {
  jobId: string;
  schema: unknown; // we'll refine later
};

export type AssessmentSubmission = {
  id: string;
  jobId: string;
  candidateId: string;
  responses: unknown;
  submittedAt: number;
};

export type AssessmentAssignment = {
  id: string; // `${jobId}:${candidateId}` for uniqueness convenience
  jobId: string;
  candidateId: string;
};

export class TalentflowDB extends Dexie {
  jobs!: Table<JobRecord, string>;
  candidates!: Table<CandidateRecord, string>;
  timelines!: Table<CandidateTimelineEvent, string>;
  assessments!: Table<AssessmentRecord, string>;
  submissions!: Table<AssessmentSubmission, string>;
  assignments!: Table<AssessmentAssignment, string>;

  constructor() {
    super('talentflow');
    this.version(1).stores({
      jobs: 'id, slug, status, order',
      candidates: 'id, jobId, stage, email',
      timelines: 'id, candidateId, timestamp',
      assessments: 'jobId',
      submissions: 'id, jobId, candidateId, submittedAt',
    });

    // upgrade for assignments table
    this.version(2).stores({
      assignments: 'id, jobId, candidateId',
    });
  }
}

export const db = new TalentflowDB();


