import { createBrowserRouter } from 'react-router-dom';

import AppShell from '@/components/AppShell';
import RequireAuth from '@/components/RequireAuth';
import DiscoverPage from '@/pages/DiscoverPage';
import LoginPage from '@/pages/auth/LoginPage';
import NotFoundPage from '@/pages/NotFoundPage';
import OnboardingPage from '@/pages/OnboardingPage';
import PlaceDetailPage from '@/pages/PlaceDetailPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <AppShell />,
    children: [
      {
        path: '/',
        element: <DiscoverPage />,
      },
    ],
  },
  {
    path: '/place/:id',
    element: <PlaceDetailPage />,
  },
  {
    element: <RequireAuth />,
    children: [
      {
        path: '/onboarding',
        element: <OnboardingPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
