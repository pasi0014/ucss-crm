import { Flex } from '@chakra-ui/react';
import { FormLabel } from '@chakra-ui/react';
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
  onChange: (index: number, value: any) => void;
}

const ClientInfo: React.FC<IClientProps> = (props) => {
  return (
    <Box>
      <Flex mt={3}>
        <FormControl mr="5%">
          <FormLabel htmlFor="first-name" fontWeight={'normal'}>
            First name
          </FormLabel>
          <Input
            id="first-name"
            value={props.client.firstName}
            onChange={(event: any) => props.onChange(props.index, event.target.value)}
            placeholder="First name"
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="last-name" fontWeight={'normal'}>
            Last name
          </FormLabel>
          <Input id="last-name" value={props.client.lastName} onChange={(event: any) => console.log(event.target.value)} placeholder="First name" />
        </FormControl>
      </Flex>
      <FormControl mt="2%">
        <FormLabel htmlFor="email" fontWeight={'normal'}>
          Email address
        </FormLabel>
        <Input id="email" type="email" value={props.client.email} onChange={(event: any) => console.log(event.target.value)} />
      </FormControl>

      <FormControl mt="2%">
        <FormLabel htmlFor="phone" fontWeight={'normal'}>
          Phone Number
        </FormLabel>
        <Input id="phone" type="phone" value={props.client.phone} onChange={(event: any) => console.log(event.target.value)} />
      </FormControl>
    </Box>
  );
};

export default ClientInfo;
