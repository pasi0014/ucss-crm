import React, { useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Heading, Flex, Button, Box, useToast } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

import { MAXIMUM_CLIENTS } from '../../utils/constants';

import ClientInfo from '../ClientInfo';
import SearchBar from '../SearchBar';
import MessageBar, { IMessageBar } from '../MessageBar';
import { ClientList, Reservation, Client } from '../../data/types/Reservation';
import { Price } from '../../data/types/Price';
import { AppContext } from '../../context/AppContext';
import { updateOrSaveClient } from './calls';

interface IReservationFormProps {
  eventId: number | undefined;
  reservation: Reservation;
  onReservationUpdate: (reservation: Reservation) => void;
}

const ReservationForm: React.FC<IReservationFormProps> = ({
  eventId,
  reservation,
  onReservationUpdate,
}) => {
  const { setAppLoading } = useContext<any>(AppContext);
  const toast = useToast();
  const [clientLists, setClientLists] = useState<ClientList[]>(
    reservation.ClientLists || [],
  );
  const [messageBar, setMessageBar] = useState<IMessageBar | null>(null);

  const handleAddGuestList = () => {
    // Validate if we reaching the maximum event capacity
    if (clientLists.length >= MAXIMUM_CLIENTS) {
      setMessageBar({
        type: 'info',
        message: `Warning: you have reached maximum clients (${MAXIMUM_CLIENTS}) per one reservation`,
      });
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

    const newClient: Client = {
      id: uuidv4(),
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      isOwner: clientLists.length === 0,
    };

    const newClientList: ClientList = {
      ClientId: newClient.id,
      Client: { ...newClient },
    };

    setClientLists((prevClientLists) => [...prevClientLists, newClientList]);
    // Update the reservation object with the updated clients array
    // Client Entity
    const ownerId =
      clientLists.length > 0
        ? clientLists.find((iClient) => iClient.isOwner)?.ClientId
        : newClient.id;
    const updatedClients = [...clientLists, newClientList];
    const updatedReservation: Reservation = {
      ...reservation,
      OwnerId: ownerId || '',
      ClientLists: updatedClients,
    };
    onReservationUpdate(updatedReservation);
  };

  const handleClientInfoChange = (
    index: number,
    fieldName: string,
    value: string | Price,
  ) => {
    setClientLists((prevClients) => {
      const updatedClients = [...prevClients];
      const clientToUpdate: any = updatedClients[index];
      if (typeof value === 'string') {
        clientToUpdate.Client[fieldName] = value;
      } else {
        clientToUpdate[fieldName] = value;
      }

      return updatedClients;
    });
    // Update the reservation object with the updated clients array
    const updatedReservation = { ...reservation, ClientLists: clientLists };
    onReservationUpdate(updatedReservation);
  };

  const handleSelectedClient = (client: Client) => {
    setMessageBar(null);
    // Validate that client already exists
    let doesExist = false;

    clientLists.map((iClientList: ClientList) => {
      if (iClientList.Client.id === client.id) {
        doesExist = true;
      }
    });

    const actualClientCount = clientLists.length + 1;

    if (actualClientCount === MAXIMUM_CLIENTS) {
      toast({
        title: 'Warning',
        description: `You have reached maximum client's capacity ${MAXIMUM_CLIENTS} per one reservation`,
        position: 'top-left',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      setMessageBar({
        type: 'warning',
        message: `You have reached maximum client's capacity of ${MAXIMUM_CLIENTS} per one reservation`,
      });
    }

    // Validate if we reaching the maximum event capacity
    if (clientLists.length >= MAXIMUM_CLIENTS) {
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

    const newClientList: ClientList = {
      ClientId: client.id,
      Client: { ...client },
      isOwner: clientLists.length === 0,
    };
    setClientLists((prevClientLists) => [...prevClientLists, newClientList]);

    // Update the reservation object with the updated clients array
    const ownerId = clientLists.length === 0 ? client.id : reservation.OwnerId;
    const updatedClients = [...clientLists, newClientList];
    const updatedReservation: Reservation = {
      ...reservation,
      OwnerId: ownerId || '',
      ClientLists: updatedClients,
    };
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
  const saveClient = async (clientList: ClientList) => {
    setAppLoading(true);

    try {
      const response = await updateOrSaveClient(clientList.Client);

      if (response.success) {
        toast({
          title: 'Success',
          description: `Client ${clientList.Client.firstName} ${clientList.Client.lastName} has been saved in the database, successfully`,
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

  const removeClient = (clientList: ClientList) => {
    setMessageBar(null);
    const updatedClients = clientLists.filter(
      (iClient) => iClient.id !== clientList.id,
    ) as ClientList[];
    if (updatedClients.length > 0) {
      updatedClients[0].isOwner = true;
    }
    setClientLists(updatedClients);
    // Update the reservation object with the updated clients array
    const ownerId = !!updatedClients.length && updatedClients[0].Client.id;
    const updatedReservation: Reservation = {
      ...reservation,
      OwnerId: ownerId || '',
      ClientLists: updatedClients,
    };
    onReservationUpdate(updatedReservation);
    toast({
      title: 'Client has been removed',
      description: `You have removed ${
        clientList.Client.firstName || 'Client'
      } from this reservation`,
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
      <Flex
        justifyContent={{ base: 'center', md: 'space-between' }}
        direction={{ base: 'column', md: 'row' }}
      >
        <Heading as="h2" my={5}>
          Client's Information
        </Heading>
        <Button
          variant="solid"
          colorScheme="teal"
          size="md"
          onClick={handleAddGuestList}
          my="auto"
        >
          <AddIcon boxSize={3} mr={2} />
          Create Client
        </Button>
      </Flex>
      <Box className="w-full mb-5 rounded-xl">
        <SearchBar entity="Client" onSelect={handleSelectedClient} />
      </Box>
      <Box>
        {clientLists.map((iClientList: ClientList, index: number) => (
          <ClientInfo
            key={index}
            index={index}
            clientList={iClientList}
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
