import { Flex } from '@chakra-ui/react';
import { FormLabel } from '@chakra-ui/react';
import { Divider } from '@chakra-ui/react';
import { useColorModeValue } from '@chakra-ui/react';
import { Button } from '@chakra-ui/react';
import { HStack } from '@chakra-ui/react';
import { Input } from '@chakra-ui/react';
import { FormControl } from '@chakra-ui/react';
import { Box } from '@chakra-ui/react';
import React from 'react';

interface IClientProps {
  index: number;
  client: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  onChange: (index: number, fieldName: string, value: string) => void;
  onSave: (clientId: string) => void;
  onDelete: (clientId: string) => void;
}

const ClientInfo: React.FC<IClientProps> = (props) => {
  return (
    <Box borderRadius="15px" boxShadow="md" bg={useColorModeValue('white', 'gray.700')} my={5} p={5}>
      <Flex mt={5} mb={5}>
        <FormControl mr="5%">
          <FormLabel htmlFor="first-name" fontWeight={'normal'}>
            First name
          </FormLabel>
          <Input
            id="first-name"
            value={props.client.firstName}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => props.onChange(props.index, 'firstName', event.target.value)}
            placeholder="First name"
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="last-name" fontWeight={'normal'}>
            Last name
          </FormLabel>
          <Input
            id="last-name"
            value={props.client.lastName}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => props.onChange(props.index, 'lastName', event.target.value)}
            placeholder="Last name"
          />
        </FormControl>
      </Flex>
      <FormControl mt="2%">
        <FormLabel htmlFor="email" fontWeight={'normal'}>
          Email address
        </FormLabel>
        <Input
          id="email"
          type="email"
          value={props.client.email}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => props.onChange(props.index, 'email', event.target.value)}
        />
      </FormControl>

      <FormControl mt="2%">
        <FormLabel htmlFor="phone" fontWeight={'normal'}>
          Phone Number
        </FormLabel>
        <Input
          id="phone"
          type="phone"
          value={props.client.phone}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => props.onChange(props.index, 'phone', event.target.value)}
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
        >
          Delete Client
        </Button>
      </Flex>
    </Box>
  );
};

export default ClientInfo;
