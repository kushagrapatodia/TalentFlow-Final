import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from '../layouts/RootLayout';
import { JobsPage } from '../features/jobs/JobsPage';
import { CandidatesPage } from '../features/candidates/CandidatesPage';
import { CandidateProfilePage } from '../features/candidates/CandidateProfilePage';
import { AssessmentsPage } from '../features/assessments/AssessmentsPage';
import { AssessmentsListPage } from '../features/assessments/AssessmentsListPage';
import { AssessmentsTakePage } from '../features/assessments/AssessmentsTakePage';
import { LandingPage } from '../features/landing/LandingPage';
import { LoginPage } from '../features/auth/LoginPage';
import { Navigate } from 'react-router-dom';
import { useAuth } from './auth';

function RequireRole(props: { children: any; allow: Array<'candidate'|'hr'> }) {
  const { role } = useAuth();
  if (!role) return <Navigate to="/login" replace />;
  if (!props.allow.includes(role)) return <Navigate to="/" replace />;
  return props.children;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'jobs', element: (
        <RequireRole allow={['candidate','hr']}>
          <JobsPage />
        </RequireRole>
      ) },
      { path: 'jobs/:jobId', element: (
        <RequireRole allow={['hr']}>
          <AssessmentsPage />
        </RequireRole>
      ) },
      { path: 'candidates', element: (
        <RequireRole allow={['hr']}>
          <CandidatesPage />
        </RequireRole>
      ) },
      { path: 'candidates/:id', element: (
        <RequireRole allow={['hr']}>
          <CandidateProfilePage />
        </RequireRole>
      ) },
      { path: 'assessments', element: (
        <RequireRole allow={['candidate']}>
          <AssessmentsListPage />
        </RequireRole>
      ) },
      { path: 'assessments/:jobId/take', element: (
        <RequireRole allow={['candidate']}>
          <AssessmentsTakePage />
        </RequireRole>
      ) },
    ],
  },
]);


