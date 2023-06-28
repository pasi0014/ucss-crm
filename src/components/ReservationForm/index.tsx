import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Heading, Flex, Button, Box, useToast } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { Client } from '../../types';

import { MAXIMUM_CLIENTS } from '../../utils/constants';

import ClientInfo from '../ClientInfo';
import SearchBar from '../SearchBar';
import MessageBar from '../MessageBar';

const ReservationForm: React.FC = (props: any) => {
  const toast = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [messageBar, setMessageBar] = useState<any>(null);

  const handleAddGuest = () => {
    setMessageBar(null);
    // Validate if we reaching the maximum event capacity
    if (clients.length >= MAXIMUM_CLIENTS) {
      setMessageBar({ type: 'info', message: `Warning: you have reached maximum clients (${MAXIMUM_CLIENTS}) per one reservation` });
      toast({
        title: 'Warning',
        description: `You have reached maximum client's capacity (${MAXIMUM_CLIENTS}) per one reservation`,
        position: 'top-right',
        status: 'warning',
        duration: 9000,
        isClosable: true,
      });
      return;
    }

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

  const handleResetError = (value: boolean) => {
    if (value) {
      setMessageBar(null);
      return;
    }
    return;
  };

  const handleSelectedClient = (client: Client) => {
    setMessageBar(null);
    // Validate that client already exists
    let doesExist = false;

    clients.map((iClient: Client) => {
      if (iClient.id === client.id) {
        doesExist = true;
      }
    });

    const actualClientCount = clients.length + 1;

    if (actualClientCount === MAXIMUM_CLIENTS) {
      toast({
        title: 'Warning',
        description: `You have reached maximum client's capacity per one reservation`,
        position: 'top-right',
        status: 'warning',
        duration: 9000,
        isClosable: true,
      });
    }

    // Validate if we reaching the maximum event capacity
    if (clients.length >= MAXIMUM_CLIENTS) {
      toast({
        title: 'Warning',
        description: `You have reached maximum client's capacity ${MAXIMUM_CLIENTS} per one reservation`,
        position: 'top-right',
        status: 'warning',
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    if (doesExist) {
      toast({
        title: 'Client has already been added',
        description: `You have already added ${client.firstName} ${client.lastName} to this reservation`,
        position: 'top-right',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    setClients((prev) => [...prev, client]);

    toast({
      title: 'Success',
      description: `You have successfully added ${client.firstName} ${client.lastName} to the reservation`,
      position: 'top-right',
      status: 'success',
      duration: 9000,
      isClosable: true,
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

      {messageBar && (
        <Flex>
          <MessageBar type={messageBar.type} message={messageBar.message} />
        </Flex>
      )}

      <Box className="w-full mb-5 rounded-xl">
        <SearchBar entity="Client" onSelect={handleSelectedClient} resetErrors={(value: boolean) => handleResetError(value)} />
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
