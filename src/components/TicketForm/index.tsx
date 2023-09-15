// TicketForm.tsx

import { useEffect, useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import { Box, Button, Flex, FormControl, FormLabel, Heading, Input, InputGroup, InputLeftElement, InputRightElement } from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
import { Price } from '../../types/Price';
import MessageBar from '../MessageBar';

interface TicketFormProps {
  isOpen: boolean;
  price?: Price | null;
  eventId: number;
  onCreate: (price: Price) => void;
  onClose: () => void;
}

const TicketForm: React.FC<TicketFormProps> = ({ isOpen, price, eventId, onCreate, onClose }) => {
  const [messageBar, setMessageBar] = useState<any>({});
  const [error, setError] = useState(false);
  const [formValues, setFormValues] = useState<Price>({
    ticketType: 'paid',
    name: '',
    amount: 0,
    EventId: eventId,
  });

  const resetFormValues = () => {
    setFormValues({
      ticketType: 'paid',
      name: '',
      amount: 0,
      EventId: eventId,
    });
  };

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
    onCreate(formValues);
  };

  useEffect(() => {
    if (price?.id !== undefined) {
      updatePriceObj(price);
    }
  }, [price]);

  return (
    <Box>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          resetFormValues();
          onClose();
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create a ticket</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Box mb="20px">
              {error && (
                <Box my={15}>
                  <MessageBar type={messageBar.type} message={messageBar.message} />
                </Box>
              )}

              <FormLabel>Ticket Type</FormLabel>
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
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={() => onCreate(formValues)}>
              Save
            </Button>
            <Button
              onClick={() => {
                resetFormValues();
                onClose();
              }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default TicketForm;
