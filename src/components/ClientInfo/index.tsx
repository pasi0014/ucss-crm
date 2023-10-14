import React, { useEffect, useState } from 'react';
import validator from 'validator';
import {
  Box,
  FormControl,
  Input,
  Button,
  Text,
  Center,
  useColorModeValue,
  Spinner,
  FormLabel,
  Flex,
} from '@chakra-ui/react';

import { findEventPrice } from '../EventDrawer/calls';

// import { Client } from '../../types/Client';
import { Price } from '../../data/types/Price';
import { Modal } from '@chakra-ui/react';
import { ModalOverlay } from '@chakra-ui/react';
import { ModalContent } from '@chakra-ui/react';
import { ModalHeader } from '@chakra-ui/react';
import { ModalCloseButton } from '@chakra-ui/react';
import { ModalBody } from '@chakra-ui/react';
import { ModalFooter } from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/react';
import MessageBar, { IMessageBar } from '../MessageBar';
import { Client, ClientList } from '../../data/types/Reservation';

interface IClientProps {
  index: number;
  clientList: ClientList;
  client?: Client;
  eventId: unknown;
  onChange: (index: number, fieldName: string, value: string | Price) => void;
  onSave: (client: ClientList) => void;
  onDelete: (client: ClientList) => void;
}

const listOfNames = [
  'Stranger',
  'Mystery',
  'Enigma',
  'Anonymous',
  'Unidentified',
  'Mysterious',
  'Unknown',
  'Unfamiliar',
  'Nameless',
  'Incognito',
  'Faceless',
  'Unseen',
  'Obscure',
  'Hidden',
  'Unrecognized',
  'Uncharted',
  'Unexplored',
  'Unsolved',
  'X-factor',
  'Uncanny',
];

const ClientInfo: React.FC<IClientProps> = ({
  index,
  clientList,
  eventId,
  onChange,
  onSave,
  onDelete,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [funnyName, setFunnyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>(null);
  const [tickets, setTickets] = useState<Price[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Price | null>(
    clientList.Price || null,
  );

  const [messageBar, setMessageBar] = useState<IMessageBar | null>(null);

  useEffect(() => {
    if (clientList.Client.firstName) {
      setFunnyName(clientList.Client.firstName);
    } else {
      const name = getRandomName();
      setFunnyName(name);
    }
  }, [clientList]);

  const getRandomName = () => {
    const randomIndex = Math.floor(Math.random() * listOfNames.length);
    return `${listOfNames[randomIndex]} client..`;
  };

  const doFetchPrices = async () => {
    setLoading(true);

    console.log('Fetching price');
    try {
      const response = await findEventPrice(eventId);

      if (!response.success) {
        throw new Error('Unexpected error : could not fetch the event price');
      }

      setTickets(response.data);
    } catch (error: any) {
      console.error('Unepxected error while trying to find the Event Price', {
        ...error,
      });
      setMessageBar({ type: 'error', message: error.message });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (eventId) {
      doFetchPrices();
    }
  }, []);

  const handleTicketSelect = (price: Price) => {
    setMessageBar(null);
    setSelectedTicket(price);
    onChange(index, 'Price', price);
  };

  const validateClient = (client: Client) => {
    const error: any = {};

    // First Name
    if (!client.firstName.length) {
      error.requiredFirstName = true;
    }
    // Last Name
    if (!client.lastName.length) {
      error.requiredLastName = true;
    }
    // Email
    if (!client.email.length) {
      error.requiredEmail = true;
    }
    if (!validator.isEmail(client.email)) {
      error.invalidEmail = true;
    }
    if (!client.phone.length) {
      error.requiredPhone = true;
    }
    if (!validator.isMobilePhone(client.phone)) {
      error.invalidPhone = true;
    }

    setErrors(error);

    return error;
  };

  const handleSave = (clientList: ClientList) => {
    setMessageBar(null);
    // Validate Client Information
    const errors = validateClient(clientList.Client);
    if (Object.keys(errors).length > 0) {
      setMessageBar({
        type: 'error',
        message: 'Please fix the highlighted fields.',
      });
      return;
    }

    // Validate that the client has selected ticket
    if (!clientList.Price) {
      setMessageBar({
        type: 'error',
        message: `Make sure that you have selected Ticket for ${
          clientList.Client.firstName || 'Client'
        }`,
      });
      return;
    } else {
      onSave(clientList);
    }
  };

  return (
    <Box
      borderRadius="15px"
      boxShadow="md"
      bg={useColorModeValue('white', 'gray.700')}
      my={5}
      p={5}
    >
      {messageBar && (
        <Box mb={5}>
          <MessageBar type={messageBar.type} message={messageBar.message} />
        </Box>
      )}
      <Box>
        <Text fontSize="lg">
          Select a ticket for <Text as="b">{funnyName}</Text>
        </Text>
        {loading && (
          <Center>
            <Spinner />
          </Center>
        )}
        <div className="flex sm:flex-row flex-col sm:space-x-4 w-full text-left">
          {!loading &&
            !!tickets.length &&
            tickets.map((iTicket) => (
              <Box
                key={iTicket.id}
                my={4}
                p={10}
                borderWidth={2}
                borderRadius="md"
                bg={
                  selectedTicket &&
                  selectedTicket?.id === iTicket.id &&
                  'teal.500'
                }
                color={
                  selectedTicket && selectedTicket?.id === iTicket.id && 'white'
                }
                className="transition-all sm:w-4/12 w-full text-left"
                textAlign="center"
                _hover={{
                  cursor: 'pointer',
                  backgroundColor: 'teal.500',
                  color: 'white',
                }}
                onClick={() => handleTicketSelect(iTicket)}
              >
                <Text
                  fontSize="md"
                  fontWeight="bold"
                  lineHeight="shorter"
                  className="text-left"
                >
                  {iTicket.name}
                </Text>
                <Text
                  fontSize="md"
                  lineHeight="shorter"
                  className="text-left"
                  mt={2}
                >
                  Ticket:{' '}
                  <b>
                    {iTicket.ticketType === 'paid'
                      ? `$${iTicket.amount}CAD`
                      : iTicket.ticketType}
                  </b>
                </Text>
              </Box>
            ))}
        </div>
      </Box>

      {/* Confirmation modal popup */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            You are about to remove Client from Reservation
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete {funnyName} from the reservation?
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="red"
              mr={3}
              onClick={() => {
                onDelete(clientList);
                onClose();
              }}
            >
              Delete
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* <Flex mt={5} mb={5}> */}
      <Flex
        direction={{ base: 'column', md: 'row' }}
        my={5}
        justifyContent="space-between"
      >
        <FormControl mr="5%" isInvalid={errors && errors.requiredFirstName}>
          <FormLabel htmlFor="first-name" fontWeight={'normal'}>
            First name
          </FormLabel>
          <Input
            id="first-name"
            value={clientList.Client.firstName}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              onChange(index, 'firstName', event.target.value)
            }
            placeholder="First name"
          />
        </FormControl>

        <FormControl
          mt={{ base: 5, md: 0 }}
          isInvalid={errors && errors.requiredLastName}
        >
          <FormLabel htmlFor="last-name" fontWeight={'normal'}>
            Last name
          </FormLabel>
          <Input
            id="last-name"
            value={clientList.Client.lastName}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              onChange(index, 'lastName', event.target.value)
            }
            placeholder="Last name"
          />
        </FormControl>
      </Flex>
      <FormControl
        mt="2%"
        isInvalid={errors && (errors.requiredEmail || errors.invalidEmail)}
      >
        <FormLabel htmlFor="email" fontWeight={'normal'}>
          Email address
        </FormLabel>
        <Input
          id="email"
          type="email"
          value={clientList.Client.email}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            onChange(index, 'email', event.target.value)
          }
          placeholder="example@mail.com"
        />
      </FormControl>

      <FormControl
        mt="2%"
        isInvalid={errors && (errors.requiredPhone || errors.invalidPhone)}
      >
        <FormLabel htmlFor="phone" fontWeight={'normal'}>
          Phone Number
        </FormLabel>
        <Input
          id="phone"
          type="phone"
          value={clientList.Client.phone}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            onChange(index, 'phone', event.target.value)
          }
          placeholder="+1-888-5555 / 18885555"
        />
      </FormControl>

      <Flex>
        <Button
          mt={7}
          _hover={{
            bg: useColorModeValue('green.400', 'green.500'),
          }}
          color={useColorModeValue('white', 'gray.100')}
          bg={useColorModeValue('green.500', 'green.600')}
          onClick={() => handleSave(clientList)}
        >
          Save Client
        </Button>
        <Button
          mt={7}
          mx={4}
          _hover={{
            bg: useColorModeValue('red.200', 'red.500'),
          }}
          color={useColorModeValue('white', 'gray.100')}
          bg={useColorModeValue('red.300', 'red.600')}
          onClick={onOpen}
        >
          Remove Client
        </Button>
      </Flex>
    </Box>
  );
};

export default ClientInfo;
