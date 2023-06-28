import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Heading, Flex, Button, Box } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { Client } from '../../types';

import ClientInfo from '../ClientInfo';
import SearchBar from '../SearchBar';

const ReservationForm: React.FC = (props: any) => {
  const [clients, setClients] = useState<Client[]>([]);

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

  return (
    <Box mt="3">
      <Flex justifyContent="space-between">
        <Heading as="h2" my={5}>
          Client's Information
        </Heading>
        <Button variant="solid" colorScheme="teal" size="md" onClick={handleAddGuest} my="auto">
          <AddIcon boxSize={3} mr={2} />
          Create Client
        </Button>
      </Flex>

      <Box width="350px" className="px-3 pb-5 pt-3 mb-5 rounded-xl">
        <SearchBar entity="Client" />
      </Box>

      <Box>
        {clients.map((iClient: any, index: number) => (
          <ClientInfo key={index} index={index} client={iClient} onChange={handleClientInfoChange} onSave={(clientId) => {}} onDelete={(clientId) => {}} />
        ))}
      </Box>
    </Box>
  );
};

export default ReservationForm;
