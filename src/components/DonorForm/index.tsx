import React, { useEffect, useState } from 'react';
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import { Donor } from '../../data/types/Donor';
import { createDonor } from './calls';
import MessageBar from '../MessageBar';
import { useColorModeValue } from '@chakra-ui/react';

interface IDonorFormDrawerProps {
  donor?: Donor;
  isOpen: boolean;
  onClose: () => void;
}

const DonorFormDrawer = (props: IDonorFormDrawerProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [formValues, setFormValues] = useState<Donor>({
    name: '',
    best_contact: '',
    lastDonation: '',
    location: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const doCreateDonor = async () => {
    setLoading(true);
    try {
      const donor = { ...formValues };
      const response = await createDonor(donor);

      if (!response.success) {
        setError({
          type: 'error',
          message: 'Unexpected error while trying to create a Donor',
        });
        throw new Error();
      }
    } catch (error) {
      console.log('Unexpected error while trying to create a donor');
    }
    setLoading(false);
  };

  const onDrawerClose = () => {
    setError(null);
    setLoading(false);
    props.onClose();
  };

  const resetForm = () => {
    setFormValues({
      name: '',
      best_contact: '',
      lastDonation: '',
      location: '',
    });
  };
  return (
    <>
      <Drawer isOpen={props.isOpen} onClose={onDrawerClose} size="md">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Add Donor</DrawerHeader>
          <DrawerBody>
            {error && <MessageBar type={error.type} message={error.message} />}
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                name="name"
                value={formValues.name}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Location</FormLabel>
              <Input
                type="text"
                name="location"
                value={formValues.location}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Best Contact</FormLabel>
              <Input
                type="text"
                name="best_contact"
                value={formValues.best_contact}
                onChange={handleInputChange}
              />
            </FormControl>
            <Button
              mt={4}
              _hover={{
                bg: useColorModeValue('green.400', 'green.500'),
              }}
              color={useColorModeValue('white', 'gray.100')}
              bg={useColorModeValue('green.500', 'green.600')}
              onClick={doCreateDonor}
            >
              Add Donor
            </Button>
            <Button
              mt={4}
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
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default DonorFormDrawer;
