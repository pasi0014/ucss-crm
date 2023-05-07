import React, { useContext, useEffect, useState } from 'react';

import {
  InputRightElement,
  InputLeftElement,
  InputGroup,
  FormControl,
  Input,
  useColorModeValue,
  Button,
  Flex,
  FormLabel,
  Heading,
  Box,
} from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';

import { AppContext } from '../../context/AppContext';
import { Price } from '../../types';
import { createPrice, findEventPrice } from './calls';

import MessageBar from '../MessageBar';

export function PriceInfo(props: { onNext: () => void; eventId: any }) {
  const { setAppLoading } = useContext<any>(AppContext);
  const [error, setError] = useState(false);
  const [messageBar, setMessageBar] = useState<any>({});

  const [formValues, setFormValues] = useState<Price>({
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

  const doFetchPrice = async () => {
    setAppLoading(true);
    setError(false);

    console.log('Fetching price');
    try {
      const response = await findEventPrice(props.eventId);

      if (!response.success) {
        throw new Error('Unexpected error : could not fetch the event price');
      }

      setFormValues((prevState) => ({
        ...prevState,
        ...response.data,
      }));
    } catch (error: any) {
      console.error('Unepxected error while trying to find the Event Price', { ...error });
      setError(true);
      setMessageBar({ type: 'error', messages: error.message });
    }
    setAppLoading(false);
  };

  const doCreatePrice = async () => {
    setAppLoading(true);
    setError(false);

    if (!validateForm()) {
      setAppLoading(false);
      return;
    }

    try {
      const price = { ...formValues };
      const response = await createPrice(price);

      if (!response.success) {
        setError(true);
        setMessageBar({
          type: 'error',
          message: 'Unexpected error while trying to create Price',
        });

        throw new Error();
      }
      props.onNext();
    } catch (error: any) {
      console.log('Unexpected error while trying to create Price');
      setMessageBar({ type: 'error', message: error.message });
    }
    setAppLoading(false);
  };

  const resetForm = () => {
    setFormValues({
      name: '',
      amount: 0,
      EventId: props.eventId,
    });

    setError(false);
  };

  const validateForm = () => {
    const errors: any = {};

    if (!formValues.name.length) {
      errors.nameError = true;
    }

    if (!formValues.amount) {
      errors.amount = true;
    }

    console.log({ errors });
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
    if (props.eventId) {
      doFetchPrice();
    }
  }, []);

  return (
    <>
      <Box>
        <Heading as="h3" size="lg" my={5}>
          Fill in Price information
        </Heading>
      </Box>
      {error && (
        <Box mb={5}>
          <MessageBar type={messageBar.type} message={messageBar.message} />
        </Box>
      )}
      <Box>
        <FormControl isRequired>
          <FormLabel>Ticket Name</FormLabel>
          <Input type="text" name="name" value={formValues.name} onChange={handleInputChange} />
        </FormControl>
        <FormControl mt={5} isRequired>
          <FormLabel>Amount</FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none" color="gray.300" fontSize="1.2em" children="$" />
            <Input type="number" name="amount" value={formValues.amount} onChange={handleInputChange} />
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
          onClick={doCreatePrice}
        >
          Create Price
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
    </>
  );
}
