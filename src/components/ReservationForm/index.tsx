import React, { useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Heading, Flex, Button, Box, useToast } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { Client } from '../../types/Client';

import { MAXIMUM_CLIENTS } from '../../utils/constants';

import ClientInfo from '../ClientInfo';
import SearchBar from '../SearchBar';
import MessageBar, { IMessageBar } from '../MessageBar';
import { Reservation } from '../../types/Reservation';
import { Price } from '../../types/Price';
import { AppContext } from '../../context/AppContext';
import { updateOrSaveClient } from './calls';

interface IReservationFormProps {
  eventId: number;
  reservation: Reservation;
  onReservationUpdate: (reservation: Reservation) => void;
}

const ReservationForm: React.FC<IReservationFormProps> = ({ eventId, reservation, onReservationUpdate }) => {
  const { setAppLoading } = useContext<any>(AppContext);
  const toast = useToast();
  const [clients, setClients] = useState<Client[]>(reservation.ClientLists || []);
  const [messageBar, setMessageBar] = useState<IMessageBar | null>(null);

  const handleAddGuest = () => {
    // Validate if we reaching the maximum event capacity
    if (clients.length >= MAXIMUM_CLIENTS) {
      setMessageBar({ type: 'info', message: `Warning: you have reached maximum clients (${MAXIMUM_CLIENTS}) per one reservation` });
      toast({
        title: 'Warning',
        description: `You have reached maximum client's capacity (${MAXIMUM_CLIENTS}) per one reservation`,
        position: 'top-left',
        status: 'warning',
        duration: 3000,
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
      isOwner: clients.length === 0,
    };

    setClients((prevClients) => [...prevClients, newClient]);
    // Update the reservation object with the updated clients array
    const ownerId = clients.length > 0 ? clients.find((iClient) => iClient.isOwner)?.id : newClient.id;
    const updatedClients = clients.length > 0 ? [...clients, newClient] : [newClient];
    const updatedReservation: Reservation = { ...reservation, OwnerId: ownerId || '', ClientLists: updatedClients };
    onReservationUpdate(updatedReservation);
  };

  const handleClientInfoChange = (index: number, fieldName: string, value: string | Price) => {
    setClients((prevClients) => {
      const updatedClients = [...prevClients];
      const clientToUpdate: any = updatedClients[index];
      clientToUpdate[fieldName] = value;
      return updatedClients;
    });
    // Update the reservation object with the updated clients array
    const updatedReservation = { ...reservation, ClientLists: clients };
    onReservationUpdate(updatedReservation);
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
        description: `You have reached maximum client's capacity ${MAXIMUM_CLIENTS} per one reservation`,
        position: 'top-left',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      setMessageBar({ type: 'warning', message: `You have reached maximum client's capacity of ${MAXIMUM_CLIENTS} per one reservation` });
    }

    // Validate if we reaching the maximum event capacity
    if (clients.length >= MAXIMUM_CLIENTS) {
      toast({
        title: 'Warning',
        description: `You have reached maximum client's capacity ${MAXIMUM_CLIENTS} per one reservation`,
        position: 'top-left',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (doesExist) {
      toast({
        title: 'Client has already been added',
        description: `You have already added ${client.firstName} ${client.lastName} to this reservation`,
        position: 'top-left',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const updatedClients = [...clients, { ...client, isOwner: clients.length === 0 }];
    setClients(updatedClients);

    // Update the reservation object with the updated clients array
    const ownerId = clients.length === 0 ? client.id : reservation.OwnerId;
    const updatedReservation: Reservation = { ...reservation, OwnerId: ownerId || '', ClientLists: updatedClients };
    onReservationUpdate(updatedReservation);

    toast({
      title: 'Success',
      description: `You have successfully added ${client.firstName} ${client.lastName} to the reservation`,
      position: 'top-left',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  // Saves client in the DB
  const saveClient = async (client: Client) => {
    setAppLoading(true);

    try {
      const response = await updateOrSaveClient(client);

      if (response.success) {
        toast({
          title: 'Success',
          description: `Client ${client.firstName} ${client.lastName} has been saved in the database, successfully`,
          position: 'top-left',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Error',
          description: `There was an error while trying to save the client in the DB. Please, try again.`,
          position: 'top-left',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        setMessageBar({ type: 'error', message: response.data });
      }
    } catch (error: any) {
      console.error(`Unepexted error :: ${error.message}`);
      setMessageBar({ type: 'error', message: error.message });
    }

    setAppLoading(false);
  };

  const removeClient = (client: Client) => {
    setMessageBar(null);
    const updatedClients = clients.filter((iClient) => iClient.id !== client.id);
    if (updatedClients.length > 0) {
      updatedClients[0].isOwner = true;
    }
    setClients(updatedClients);
    // Update the reservation object with the updated clients array
    const ownerId = !!updatedClients.length && updatedClients[0].id;
    const updatedReservation: Reservation = { ...reservation, OwnerId: ownerId || '', ClientLists: updatedClients };
    onReservationUpdate(updatedReservation);
    toast({
      title: 'Client has been removed',
      description: `You have removed ${client.firstName || 'Client'} from this reservation`,
      position: 'top-left',
      status: 'warning',
      duration: 9000,
      isClosable: true,
    });
  };

  return (
    <Box mt="3">
      {messageBar && (
        <Flex>
          <MessageBar type={messageBar.type} message={messageBar.message} />
        </Flex>
      )}
      <Flex justifyContent={{ base: 'center', md: 'space-between' }} direction={{ base: 'column', md: 'row' }}>
        <Heading as="h2" my={5}>
          Client's Information
        </Heading>
        <Button variant="solid" colorScheme="teal" size="md" onClick={handleAddGuest} my="auto">
          <AddIcon boxSize={3} mr={2} />
          Create Client
        </Button>
      </Flex>
      <Box className="w-full mb-5 rounded-xl">
        <SearchBar entity="Client" onSelect={handleSelectedClient} />
      </Box>
      <Box>
        {clients.map((iClient: any, index: number) => (
          <ClientInfo
            key={index}
            index={index}
            client={iClient}
            onChange={handleClientInfoChange}
            eventId={eventId}
            onSave={saveClient}
            onDelete={removeClient}
          />
        ))}
      </Box>
    </Box>
  );
};

export default ReservationForm;
