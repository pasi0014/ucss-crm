import { useContext, useEffect, useState } from 'react';

import { useToast, useColorModeValue, Button, Heading, Box } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

import { AppContext } from '../../context/AppContext';
import { Price } from '../../types';
import { createPrice, deletePrice, findEventPrice, updatePrice } from './calls';

import MessageBar from '../MessageBar';
import TicketForm from '../TicketForm';

export function PriceInfo(props: { onNext: () => void; eventId: any }) {
  const toast = useToast();
  const { setAppLoading } = useContext<any>(AppContext);
  const [tickets, setTickets] = useState<any>([]);
  const [messageBar, setMessageBar] = useState<any>({});

  const [error, setError] = useState(false);

  const handleAddTicket = (ticketData: Price) => {
    setTickets((prevTickets: Price[]) => [...prevTickets, ticketData]);
  };

  const handleCreateTicket = (ticketData: Price) => {
    doCreatePrice(ticketData);
  };

  const handleUpdateTicket = (index: number, ticketData: Price) => {
    doUpdatePrice(index, ticketData);
  };

  const handleRemoveTicket = (index: number) => {
    const ticketToRemove = tickets[index];

    if (!ticketToRemove) {
      setError(true);
      setMessageBar({ type: 'error', message: 'Unexpected error while deleting the Ticket' });
      return;
    }

    if (ticketToRemove.id) {
      doDeletePrice(ticketToRemove);
    } else {
      setTickets((prevTickets: Price[]) => {
        const updatedTickets = [...prevTickets];
        updatedTickets.splice(index, 1);
        return updatedTickets;
      });
    }
  };

  const doDeletePrice = async (price: Price) => {
    setAppLoading(true);
    setError(false);

    console.log('Deleting price');
    try {
      const response = await deletePrice(price.id);

      if (!response.success) {
        throw new Error('Unexpected error : could not delete the event price');
      }

      const filteredTickets = tickets.filter((iTicket: Price) => iTicket.id !== price.id);
      setTickets(filteredTickets);
      toast({
        title: 'Price Deleted Successfully!',
        description: `You have deleted ticket ${price.name}`,
        position: 'top-right',
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
    } catch (error: any) {
      console.error('Unepxected error while trying to delete the Event Price', { ...error });
      setError(true);
      setMessageBar({ type: 'error', messages: error.message });
    }
    setAppLoading(false);
  };

  const doFetchPrice = async () => {
    setAppLoading(true);
    setError(false);

    console.log('Fetching price');
    try {
      const response = await findEventPrice(props.eventId);

      if (!response.success) {
        throw new Error('Unexpected error : could not fetch the event price');
      }

      setTickets(response.data);
    } catch (error: any) {
      console.error('Unepxected error while trying to find the Event Price', { ...error });
      setError(true);
      setMessageBar({ type: 'error', messages: error.message });
    }
    setAppLoading(false);
  };

  const doCreatePrice = async (price: Price) => {
    setAppLoading(true);
    setError(false);

    try {
      const response = await createPrice(price);

      if (!response.success) {
        setError(true);
        setMessageBar({
          type: 'error',
          message: 'Unexpected error while trying to create Price',
        });

        throw new Error(response.data);
      }
      toast({
        title: 'Price Created Successfully!',
        description: `You have created ticket ${price.name}`,
        position: 'top-right',
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
      setMessageBar({ type: 'success', message: 'Price was successfully created' });
    } catch (error: any) {
      console.error('Unexpected error while trying to create Price', { ...error });
      setMessageBar({ type: 'error', message: error.message });
    }
    setAppLoading(false);
  };

  const doUpdatePrice = async (index: number, price: Price) => {
    setAppLoading(true);
    setError(false);

    try {
      const response = await updatePrice(price);

      if (!response.success) {
        setError(true);
        setMessageBar({
          type: 'error',
          message: 'Unexpected error while trying to create Price',
        });

        throw new Error(response.data);
      }
      setTickets((prevTickets: Price[]) => {
        const updatedTickets = [...prevTickets];
        updatedTickets[index] = response.data;
        return updatedTickets;
      });
      toast({
        title: 'Price Updated Successfully!',
        description: `You have updated ticket ${price.name}`,
        position: 'top-right',
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
      setMessageBar({ type: 'success', message: 'Price was successfully updated' });
    } catch (error: any) {
      console.error('Unexpected error while trying to create Price', { ...error });
      setMessageBar({ type: 'error', message: error.message });
    }
    setAppLoading(false);
  };

  useEffect(() => {
    if (props.eventId) {
      doFetchPrice();
    }
  }, []);

  return (
    <>
      <Box mt="15px">
        <Heading as="h3" size="lg" my={5}>
          Create a Ticket(s) for your event
        </Heading>
      </Box>
      {error && (
        <Box mb={5}>
          <MessageBar type={messageBar.type} message={messageBar.message} />
        </Box>
      )}
      <Box mb="15px">
        <Button
          bg={useColorModeValue('green.400', 'green.500')}
          _hover={{
            bg: useColorModeValue('green.300', 'green.400'),
          }}
          color={useColorModeValue('white', 'gray.100')}
          onClick={() => handleAddTicket({ ticketType: 'paid', name: '', amount: 0, EventId: props.eventId })}
        >
          <AddIcon boxSize={3} mr="5px" />
          Add a Ticket
        </Button>
      </Box>
      {tickets.map((ticket: any, index: number) => (
        <TicketForm
          key={index}
          index={index}
          price={ticket}
          eventId={props.eventId}
          onCreateTicket={handleCreateTicket}
          onUpdateTicket={handleUpdateTicket}
          onRemoveTicket={handleRemoveTicket}
        />
      ))}
    </>
  );
}
