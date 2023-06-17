import { Outlet } from 'react-router-dom';
import SidebarWithHeader from './components/SidebarWithHeader';

const Admin: React.FC = () => {
  return (
    <SidebarWithHeader>
      <Outlet />
    </SidebarWithHeader>
  );
};

export default Admin;
