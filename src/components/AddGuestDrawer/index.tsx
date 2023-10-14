import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { ClientList } from '../../data/types/Reservation';

interface IAddGuestDrawer {
  statuses: object | undefined;
}

const AddGuestDrawer: React.FC<IAddGuestDrawer> = ({ statuses }) => {
  const [clientList, setClientList] = useState<ClientList>();

  useEffect(() => {
    const uid = uuidv4();

    setClientList({
      ClientId: uid,
      Client: {
        id: uid,
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
      },
    });
  }, []);

  return <div>Add Guest Drawer</div>;
};

export default AddGuestDrawer;
