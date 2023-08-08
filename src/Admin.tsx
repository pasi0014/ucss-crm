import { Outlet } from 'react-router-dom';
import SidebarWithHeader from './components/SidebarWithHeader';
import { useContext, useEffect } from 'react';
import { StatusContext } from './context/StatusContext';

const Admin: React.FC = () => {
  return (
    <SidebarWithHeader>
      <Outlet />
    </SidebarWithHeader>
  );
};

export default Admin;
