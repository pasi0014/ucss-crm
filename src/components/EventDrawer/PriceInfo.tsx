import { useContext, useEffect, useState } from 'react';

import { useColorModeValue, Button, Heading, Box } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

import { AppContext } from '../../context/AppContext';
import { Price } from '../../types';
import { createPrice, deletePrice, findEventPrice, updatePrice } from './calls';

import MessageBar from '../MessageBar';
import TicketForm from '../TicketForm';

export function PriceInfo(props: { onNext: () => void; eventId: any }) {
  const { setAppLoading } = useContext<any>(AppContext);
  const [tickets, setTickets] = useState<any>([]);
  const [isNewPrice, setIsNewPrice] = useState(true);
  const [messageBar, setMessageBar] = useState<any>({});

  const [error, setError] = useState(false);

  const [formValues, setFormValues] = useState<Price>({
    name: '',
    amount: 0,
    EventId: props.eventId,
    ticketType: 'paid',
  });

  const handleAddTicket = (ticketData: Price) => {
    console.log('Adjust ui');
    setTickets((prevTickets: Price[]) => [...prevTickets, ticketData]);
  };

  const handleCreateTicket = (ticketData: Price) => {
    console.log('make calls to create the ticket');
    doCreatePrice(ticketData);
  };

  const handleUpdateTicket = (index: number, ticketData: Price) => {
    console.log('make calls to update the ticket');
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
      doDeletePrice(ticketToRemove.id);
    } else {
      setTickets((prevTickets: Price[]) => {
        const updatedTickets = [...prevTickets];
        updatedTickets.splice(index, 1);
        return updatedTickets;
      });
    }
  };

  const doDeletePrice = async (id: number) => {
    setAppLoading(true);
    setError(false);

    console.log('Deleting price');
    try {
      const response = await deletePrice(id);
      console.log({ response });
      if (!response.success) {
        throw new Error('Unexpected error : could not delete the event price');
      }

      const filteredTickets = tickets.filter((iTicket: Price) => iTicket.id !== id);
      setTickets(filteredTickets);
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
      setIsNewPrice(false);
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
      setTickets((prevTickets: Price[]) => [...prevTickets, response.data]);
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
    } else {
      setIsNewPrice(true);
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

      {/* I want to extract this code to the separate component */}
      {/* <Box
        shadow="md"
        px="15px"
        py="15px"
        bg={useColorModeValue('white', 'gray.700')}
        border="1px"
        borderRadius="15px"
        borderColor={useColorModeValue('gray.100', 'gray.400')}
      >
        <Box>
          <Box mb="20px">
            <Flex minWidth="max-content" alignItems="center" gap="2">
              <Box p="2">
                <Heading size="md" mb="15px">
                  Ticket Info
                </Heading>
              </Box>
              <Spacer />
              <Button width="20px">X</Button>
            </Flex>
            <Flex>
              <Button
                variant={formValues.ticketType === 'paid' ? 'solid' : 'outline'}
                mr="15px"
                width="130px"
                onClick={() => setFormValues({ ...formValues, ticketType: 'paid' })}
              >
                Paid
              </Button>
              <Button
                variant={formValues.ticketType === 'free' ? 'solid' : 'outline'}
                width="130px"
                onClick={() => setFormValues({ ...formValues, ticketType: 'free', amount: 0 })}
              >
                Free
              </Button>
            </Flex>
          </Box>
          <FormControl isRequired>
            <FormLabel>Ticket Name</FormLabel>
            <Input type="text" name="name" value={formValues.name} onChange={handleInputChange} />
          </FormControl>
          <FormControl mt={5} isRequired>
            <FormLabel>Amount</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none" color="gray.300" fontSize="1.2em" children="$" />
              <Input disabled={ticketType === 'free' ? true : false} type="number" name="amount" value={formValues.amount} onChange={handleInputChange} />
              <InputRightElement children={<CheckIcon color="green.500" />} />
            </InputGroup>
          </FormControl>
        </Box>
        <Flex>
          <Button
            mt={7}
            _hover={{
              bg: useColorModeValue('green.400', 'green.500'),
            }}
            color={useColorModeValue('white', 'gray.100')}
            bg={useColorModeValue('green.500', 'green.600')}
            onClick={isNewPrice ? doCreatePrice : doUpdatePrice}
          >
            {isNewPrice ? 'Create' : 'Update'} Price
          </Button>
          <Button
            mt={7}
            mx={4}
            _hover={{
              bg: useColorModeValue('red.200', 'red.500'),
            }}
            color={useColorModeValue('white', 'gray.100')}
            bg={useColorModeValue('red.300', 'red.600')}
            onClick={resetForm}
          >
            Reset Form
          </Button>
        </Flex>
      </Box> */}
    </>
  );
}
