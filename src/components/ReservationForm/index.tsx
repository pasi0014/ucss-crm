import React, { useState } from 'react';
import { Flex, Button, Box } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

import ClientInfo from '../ClientInfo';

const ReservationForm: React.FC = (props: any) => {
  const [clients, setClients] = useState<any[]>([]);

  const handleAddGuest = () => {
    const newClient = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    };

    setClients((prevClients) => [...prevClients, newClient]);
  };

  const handleClientInfoChange = (index: number, updatedClientInfo: any) => {
    console.log({ index, updatedClientInfo });
    // setClients((prevClients) => {
    //   const updatedClients = [...prevClients];
    //   updatedClients[index] = updatedClientInfo;
    //   return updatedClients;
    // });
  };

  return (
    <Box mt="3">
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Flex alignItems="center">
          <Button variant="solid" colorScheme="teal" size="md" onClick={handleAddGuest}>
            <AddIcon boxSize={3} mr={3} />
            Add Guest
          </Button>
        </Flex>
      </Flex>

      <Box>
        {clients.map((iClient: any, index: number) => (
          <ClientInfo key={index} index={index} client={iClient} onChange={handleClientInfoChange} />
        ))}
      </Box>
    </Box>
  );
};

export default ReservationForm;
