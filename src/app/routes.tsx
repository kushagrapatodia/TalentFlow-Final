import { createBrowserRouter, useLocation, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { RootLayout } from '../layouts/RootLayout';
import { HRLayout } from '../layouts/HRLayout';
import { CandidateLayout } from '../layouts/CandidateLayout';
import { JobsPage } from '../features/jobs/JobsPage';
import { JobDetailPage } from '../features/jobs/JobDetailPage';
import { CandidatesPage } from '../features/candidates/CandidatesPage';
import { CandidateProfilePage } from '../features/candidates/CandidateProfilePage';
import { AssessmentsPage } from '../features/assessments/AssessmentsPage';
import { AssessmentsListPage } from '../features/assessments/AssessmentsListPage';
import { AssessmentsTakePage } from '../features/assessments/AssessmentsTakePage';
import { AssessmentBuilderPage } from '../features/assessments/AssessmentBuilderPage';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { CandidateDashboardPage } from '../features/dashboard/CandidateDashboardPage';
import { LandingPage } from '../features/landing/LandingPage';
import { LoginPage } from '../features/auth/LoginPage';
import { useAuth } from './auth';

function RequireRole(props: { children: any; allow: Array<'candidate'|'hr'> }) {
  const { role } = useAuth();
  if (!role) return <Navigate to="/" replace />;
  if (!props.allow.includes(role)) return <Navigate to="/" replace />;
  return props.children;
}

function RoleBasedLayout() {
  const { role } = useAuth();
  const location = useLocation();
  
  // Check if we're at the root path or login
  const isPublicPath = location.pathname === '/' || location.pathname === '/login';
  
  useEffect(() => {
    // If user is not authenticated and trying to access protected routes
    if (!role && !isPublicPath) {
      window.location.href = '/';
    }
  }, [role, location.pathname, isPublicPath]);
  
  if (role === 'hr') {
    return <HRLayout />;
  } else if (role === 'candidate') {
    return <CandidateLayout />;
  }
  
  // Only show RootLayout for public paths
  if (isPublicPath) {
    return <RootLayout />;
  }
  
  // Redirect to home for any other case
  return <Navigate to="/" replace />;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RoleBasedLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'login', element: <LoginPage /> },
      
      // Dashboard (HR only)
      { path: 'dashboard', element: (
        <RequireRole allow={['hr']}>
          <DashboardPage />
        </RequireRole>
      ) },

      // Candidate Dashboard
      { path: 'candidate/dashboard', element: (
        <RequireRole allow={['candidate']}>
          <CandidateDashboardPage />
        </RequireRole>
      ) },
      
      // Jobs (both roles)
      { path: 'jobs', element: (
        <RequireRole allow={['candidate','hr']}>
          <JobsPage />
        </RequireRole>
      ) },
      
      // Job Detail (both roles)
      { path: 'jobs/:jobId', element: (
        <RequireRole allow={['candidate','hr']}>
          <JobDetailPage />
        </RequireRole>
      ) },
      
      // Candidates (HR only)
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
      
      // Assessments (candidates see list, HR sees builder)
      { path: 'assessments', element: (
        <RequireRole allow={['candidate']}>
          <AssessmentsListPage />
        </RequireRole>
      ) },
      { path: 'assessments/builder', element: (
        <RequireRole allow={['hr']}>
          <AssessmentBuilderPage />
        </RequireRole>
      ) },
        // HR can build assessment for a specific job
        { path: 'assessments/:jobId', element: (
          <RequireRole allow={['hr']}>
            <AssessmentsPage />
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


