import moment from 'moment';
import React, { useState } from 'react';
import { withAuthUser } from 'react-auth-kit';
import { Divider, Flex, Input, FormLabel, FormControl, Button, useColorModeValue, Box, Heading } from '@chakra-ui/react';
import { Switch } from '@chakra-ui/react';

function generateInitias(firstName: string = '', lastName: string = '') {
  const firstInitial = firstName.charAt(0).toUpperCase();
  const lastInitial = lastName.charAt(0).toUpperCase();

  return `${firstInitial}${lastInitial}`;
}

const ProfileView: React.FC = (props: any) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const borderColor = useColorModeValue('border-gray-300', 'border-gray-500');

  const validatePassword = () => {
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
    } else if (password !== confirmPassword) {
      setPasswordError('Passwords do not match.');
    } else {
      setPasswordError('');
    }
  };

  return (
    <Box>
      <Box textAlign="left" my={5} p={3}>
        <Heading>My Profile</Heading>
      </Box>

      <Box className={`${borderColor} border rounded-xl flex flex-row items-center`} p={5} bg={useColorModeValue('gray.50', 'gray.700')}>
        <Box
          className="hidden sm:inline-flex items-center justify-center rounded-full shadow-sm h-16 w-16 mr-3 text-lg font-bold"
          bg={useColorModeValue('blue.100', 'blue.300')}
        >
          {generateInitias(props.authState.firstName, props.authState.lastName)}
        </Box>
        <Box className="flex flex-col">
          <Box className="font-bold">
            {props.authState.firstName} {props.authState.lastName}
          </Box>
          <Box color={useColorModeValue('gray.500', 'gray.400')}>Coordinator</Box>
          <Box color={useColorModeValue('gray.500', 'gray.400')} className="text-sm">
            Permissions: ADMIN
          </Box>
          <Box color={useColorModeValue('gray.500', 'gray.400')} className="text-sm">
            Profile created at: {moment(props.authState.createdAt).utc().format('MMMM D, YYYY')}
          </Box>
          <Box color={useColorModeValue('gray.500', 'gray.400')} className="text-sm">
            Profile created by: {props.authState.createdBy}
          </Box>
        </Box>
      </Box>

      <Box className={`${borderColor} border w-full rounded-lg flex flex-col items-center my-6`} p={5} bg={useColorModeValue('gray.50', 'gray.700')}>
        <Box className="w-full flex md:flex-row flex-col">
          <Box className="md:w-4/12 w-full p-3 flex flex-col">
            <span className="text-md font-bold w-full">Personal Information</span>
            <span className="mt-2 text-sm w-10/12">This information will be used to identify you as a system user.</span>
          </Box>
          <Box className="w-10/12 p-3">
            <Flex direction={{ base: 'column', md: 'row' }} justifyContent="space-between">
              <FormControl mr="5%" isRequired>
                <FormLabel htmlFor="firstName" fontWeight={'normal'}>
                  First name
                </FormLabel>
                <Input id="firstName" onChange={(event: React.ChangeEvent<HTMLInputElement>) => console.log(event.target.value)} placeholder="John" />
              </FormControl>

              <FormControl mt={{ base: 5, md: 0 }} isRequired>
                <FormLabel htmlFor="lastName" fontWeight={'normal'}>
                  Last name
                </FormLabel>
                <Input id="lastName" onChange={(event: React.ChangeEvent<HTMLInputElement>) => console.log(event.target.value)} placeholder="Doe" />
              </FormControl>
            </Flex>
            <Flex direction={{ base: 'column', md: 'row' }} justifyContent="space-between" mt={5} isRequired>
              <FormControl mr="5%" isRequired>
                <FormLabel htmlFor="email" fontWeight={'normal'}>
                  Email
                </FormLabel>
                <Input id="email" onChange={(event: React.ChangeEvent<HTMLInputElement>) => console.log(event.target.value)} placeholder="example@email.com" />
              </FormControl>

              <FormControl mt={{ base: 5, md: 0 }} isRequired>
                <FormLabel htmlFor="phone" fontWeight={'normal'}>
                  Phone
                </FormLabel>
                <Input id="phone" onChange={(event: React.ChangeEvent<HTMLInputElement>) => console.log(event.target.value)} placeholder="+1 555-555-5555" />
              </FormControl>
            </Flex>
            <Flex direction={{ base: 'column', md: 'row' }} justifyContent="space-between" mt={5}>
              <FormControl isRequired>
                <FormLabel htmlFor="role" fontWeight={'normal'}>
                  Role in the organization
                </FormLabel>
                <Input id="role" onChange={(event: React.ChangeEvent<HTMLInputElement>) => console.log(event.target.value)} placeholder="coordinator" />
              </FormControl>
            </Flex>
          </Box>
        </Box>
        <Divider my={10} />

        <Box className="w-full flex md:flex-row flex-col">
          <Box className="md:w-4/12 w-full p-3 flex flex-col">
            <span className="text-md font-bold w-full">App Notifications</span>
          </Box>
          <Box className="w-10/12 p-3">
            <Flex direction={{ base: 'column', md: 'row' }} justifyContent="space-between">
              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="email-alerts" mb="0">
                  Receive app notifications via email
                </FormLabel>
                <Switch id="email-alerts" />
              </FormControl>

              <FormControl display="flex" alignItems="center" mt={{ base: 5, md: 0 }}>
                <FormLabel htmlFor="email-alerts" mb="0">
                  Enable in app push notifications
                </FormLabel>
                <Switch id="email-alerts" />
              </FormControl>
            </Flex>
          </Box>
        </Box>
        <Divider my={10} />

        <Box className="w-full flex md:flex-row flex-col">
          <Box className="md:w-4/12 w-full p-3 flex flex-col">
            <span className="text-md font-bold w-full">Password Change</span>
            <span className="mt-2 text-sm w-10/12"></span>
          </Box>
          <Box className="w-10/12 p-3">
            <Flex direction={{ base: 'column', md: 'row' }} justifyContent="space-between">
              <FormControl mr="5%">
                <FormLabel htmlFor="password" fontWeight={'normal'}>
                  New password
                </FormLabel>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
                />
              </FormControl>

              <FormControl mt={{ base: 5, md: 0 }}>
                <FormLabel htmlFor="confirmPassword" fontWeight={'normal'}>
                  Confirm password
                </FormLabel>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(event.target.value)}
                />
              </FormControl>
            </Flex>
          </Box>
        </Box>

        <Flex my={10} className="w-full flex" justifyContent="end">
          <Button colorScheme="red" mr="2%" className="sm:w-24 w-6/12">
            Reset
          </Button>
          <Button colorScheme="blue" className="sm:w-24 w-6/12">
            Save
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default withAuthUser(ProfileView);
