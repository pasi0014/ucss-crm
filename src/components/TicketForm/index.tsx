// TicketForm.tsx

import { useEffect, useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import { Box, Button, Flex, FormControl, FormLabel, Heading, Input, InputGroup, InputLeftElement, InputRightElement } from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
import { Spacer } from '@chakra-ui/react';
import { Price } from '../../types/Price';
import MessageBar from '../MessageBar';
import { useDisclosure } from '@chakra-ui/react';
import { useColorModeValue } from '@chakra-ui/react';

const TicketForm = (props: {
  eventId: number;
  price?: Price;
  index: number;
  onCreateTicket: (values: any) => void;
  onUpdateTicket: (index: number, values: Price) => void;
  onRemoveTicket: (values: any) => void;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [messageBar, setMessageBar] = useState<any>({});
  const [newTicket, setNewTicket] = useState(true);
  const [error, setError] = useState(false);
  const [formValues, setFormValues] = useState<Price>({
    ticketType: 'paid',
    name: '',
    amount: 0,
    EventId: props.eventId,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const updatePriceObj = (price?: Price) => {
    setFormValues((prevState) => ({
      ...prevState,
      ...price,
    }));
  };

  const createTicket = () => {
    if (!validateForm()) {
      return;
    }
    props.onCreateTicket(formValues);
  };

  const removeTicket = () => {
    onClose();
    props.onRemoveTicket(props.index);
  };

  const updateTicket = () => {
    if (!validateForm()) {
      return;
    }
    props.onUpdateTicket(props.index, formValues);
  };

  const validateForm = () => {
    const errors: any = {};

    if (!formValues.name.length) {
      errors.nameError = true;
    }

    if (!formValues.amount && formValues.ticketType === 'paid') {
      errors.amount = true;
    }

    if (Object.keys(errors).length) {
      setError(true);
      setMessageBar({
        type: 'error',
        message: 'The form contains errors. Please enter all required information',
      });
      return false;
    }

    setError(false);
    setMessageBar({});
    return true;
  };

  useEffect(() => {
    if (props.price?.id !== undefined) {
      setNewTicket(false);
      updatePriceObj(props.price);
    }
  }, [props.price]);

  return (
    <Box
      shadow="md"
      px="15px"
      py="15px"
      mb="25px"
      bg={useColorModeValue('white', 'gray.700')}
      border="1px"
      borderRadius="15px"
      borderColor={useColorModeValue('gray.100', 'gray.400')}
    >
      {/* Confirmation modal popup */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>You are about to delete Ticket</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure you want to delete this Ticket?</ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={removeTicket}>
              Delete
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* Ticket Info  */}
      <Box mb="20px">
        <Flex minWidth="max-content" alignItems="center" gap="2">
          <Box p="2">
            <Heading size="md" mb="15px">
              Ticket Info
            </Heading>
          </Box>
          <Spacer />
          <Button width="15px" onClick={onOpen}>
            X
          </Button>
        </Flex>
        {error && (
          <Box my={15}>
            <MessageBar type={messageBar.type} message={messageBar.message} />
          </Box>
        )}
        <Flex direction={{ base: 'column', md: 'row' }} mt={{ base: '25px', md: '5px' }}>
          <Button
            variant={formValues.ticketType === 'paid' ? 'solid' : 'outline'}
            mb={{ base: '5', md: '0' }}
            mr="15px"
            width={{ base: '100%', md: '130px' }}
            onClick={() => setFormValues({ ...formValues, ticketType: 'paid' })}
          >
            Paid
          </Button>
          <Button
            variant={formValues.ticketType === 'free' ? 'solid' : 'outline'}
            width={{ base: '100%', md: '130px' }}
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
          <Input disabled={formValues.ticketType === 'free'} type="number" name="amount" value={formValues.amount} onChange={handleInputChange} />
          <InputRightElement children={<CheckIcon color="green.500" />} />
        </InputGroup>
      </FormControl>
      <Button
        mt={7}
        _hover={{
          bg: 'green.500',
        }}
        color="white"
        bg="green.500"
        onClick={newTicket ? createTicket : updateTicket}
      >
        {newTicket ? 'Create' : 'Update'} Price
      </Button>
    </Box>
  );
};

export default TicketForm;
