import { useContext, useEffect, useState } from 'react';

import { useDisclosure, useToast, useColorModeValue, Button, Heading, Box } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

import { AppContext } from '../../context/AppContext';
import { Price } from '../../types/Price';
import { createPrice, deletePrice, findEventPrice, updatePrice } from './calls';

import MessageBar from '../MessageBar';
import TicketForm from '../TicketForm';
import PriceList from '../PriceList';

export default function PriceInfo(props: { onNext: () => void; eventId: any; statuses: any }) {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { setAppLoading } = useContext<any>(AppContext);
  const [tickets, setTickets] = useState<any>([]);
  const [messageBar, setMessageBar] = useState<any>({});
  const [selectedPrice, setSelectedPrice] = useState<Price | null>(null);

  const [error, setError] = useState(false);

  const onEdit = (price: Price) => {
    setSelectedPrice(price);
    onOpen();
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

  const doUpdateOrCreatePrice = async (price: Price) => {
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
      // Find the index of the ticket in the tickets array, if it exists
      const ticketIndex = tickets.findIndex((iPrice: Price) => iPrice.id === price.id);

      if (ticketIndex === -1) {
        // If the ticket doesn't exist, add it to the tickets array
        setTickets((prevTickets: Price[]) => [...prevTickets, price]);
      } else {
        // If the ticket exists, update it by creating a new array with the updated ticket
        setTickets((prevTickets: Price[]) => {
          const updatedTickets = [...prevTickets];
          updatedTickets[ticketIndex] = price;
          return updatedTickets;
        });
      }

      toast({
        title: 'Price Saved Successfully!',
        description: `You have saved ticket ${price.name}`,
        position: 'top-right',
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
      onClose();
      setMessageBar({ type: 'success', message: 'Price was successfully saved' });
    } catch (error: any) {
      console.error('Unexpected error while trying to save Price', { ...error });
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
          onClick={onOpen}
        >
          <AddIcon boxSize={3} mr="5px" />
          Add a Ticket
        </Button>
      </Box>
      <TicketForm
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setSelectedPrice(null);
        }}
        price={selectedPrice}
        onCreate={(price: Price) => doUpdateOrCreatePrice(price)}
        eventId={props.eventId}
      />
      <Heading size="md">Tickets</Heading>
      <Box className="sm:w-6/12 w-full">
        <PriceList prices={tickets} statuses={props.statuses} onDelete={doDeletePrice} onEdit={onEdit} />
      </Box>
    </>
  );
}
