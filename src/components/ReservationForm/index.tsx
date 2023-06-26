import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Flex, Button, Box } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { Client } from '../../types';

import ClientInfo from '../ClientInfo';
import SearchBar from '../SearchBar';

const ReservationForm: React.FC = (props: any) => {
  const [clients, setClients] = useState<Client[]>([
    // {
    //   id: uuidv4(),
    //   firstName: '',
    //   lastName: '',
    //   phone: '',
    //   email: '',
    // },
  ]);

  const handleAddGuest = () => {
    const newClient = {
      id: uuidv4(),
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    };

    setClients((prevClients) => [...prevClients, newClient]);
  };

  const handleClientInfoChange = (index: number, fieldName: string, value: string) => {
    setClients((prevClients) => {
      const updatedClients = [...prevClients];
      const clientToUpdate: any = updatedClients[index];
      clientToUpdate[fieldName] = value;
      return updatedClients;
    });
  };

  const handleSaveClient = (id: string) => {};

  return (
    <Box mt="3" height={100}>
      <Flex alignItems="center" justifyContent="space-between">
        <Box width="350px" height={100}>
          <SearchBar entity="Client" />
        </Box>
        <Flex alignItems="center">
          <Button variant="solid" colorScheme="teal" size="md" onClick={handleAddGuest}>
            <AddIcon boxSize={3} mr={2} />
            Create Client
          </Button>
        </Flex>
      </Flex>

      <Box>
        {clients.map((iClient: any, index: number) => (
          <ClientInfo key={index} index={index} client={iClient} onChange={handleClientInfoChange} onSave={(clientId) => {}} onDelete={(clientId) => {}} />
        ))}
      </Box>
    </Box>
  );
};

export default ReservationForm;
