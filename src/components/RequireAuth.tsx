import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { Skeleton } from '@/components/ui/skeleton';
import { useMe } from '@/hooks/useMe';
import { LOGIN_PATH } from '@/lib/navigate';

function AppSkeleton() {
  return (
    <div className="mx-auto w-full max-w-2xl space-y-4 p-4" aria-busy="true">
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}

export default function RequireAuth() {
  const location = useLocation();

  const me = useMe();

  if (me.isPending) {
    return <AppSkeleton />;
  }

  if (me.isError) {
    return <Navigate to={LOGIN_PATH} replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
