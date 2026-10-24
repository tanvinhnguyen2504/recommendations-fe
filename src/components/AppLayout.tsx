import { Outlet } from 'react-router-dom';

import AppHeader from './AppHeader';

export default function AppLayout() {
  return (
    <div className="min-h-dvh">
      <AppHeader />
      <main
        className="mx-auto w-full max-w-3xl px-3 py-4"
        style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
      >
        <Outlet />
      </main>
    </div>
  );
}
