import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import LoadingPage from './components/LoadingPage';
const SidebarWithHeader = React.lazy(() => import('./components/SidebarWithHeader'));

const Admin: React.FC = () => {
  return (
    <Suspense fallback={<LoadingPage />}>
      <SidebarWithHeader>
        <Outlet />
      </SidebarWithHeader>
    </Suspense>
  );
};

export default Admin;
