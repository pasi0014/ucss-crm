import React, { useCallback, useState } from 'react';
import { Heading } from '@chakra-ui/react';
import { Flex } from '@chakra-ui/react';
import { Icon } from '@chakra-ui/react';
import { Button } from '@chakra-ui/react';
import { useColorModeValue } from '@chakra-ui/react';
import { Box } from '@chakra-ui/react';

import { AddIcon, Search2Icon } from '@chakra-ui/icons';
import ReservationList from '../../components/ReservationList';
import { InputGroup } from '@chakra-ui/react';
import { InputLeftElement } from '@chakra-ui/react';
import { Input } from '@chakra-ui/react';

const Reservations: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenDrawer = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }

  return (
    <React.Fragment>
      <Box textAlign="left" my={5} p={3}>
        <Heading>Reservations</Heading>
      </Box>

      <Box className="flex md:flex-row flex-col">
        <Box className="md:w-5/12 w-full md:mr-5">
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Search2Icon color="gray.300" />
            </InputLeftElement>
            <Input
              type="text"
              bg={useColorModeValue('white', 'gray.700')}
              placeholder={`Search reservations`}
              value={searchTerm}
              onChange={handleChange}
              sx={{
                color: isLoading
                  ? useColorModeValue('gray.300', 'gray.500')
                  : useColorModeValue('gray.500', 'white'),
              }}
            />
          </InputGroup>
        </Box>
        <Box className="bg-red-100 md:mr-5">
          <input type="date" className='w-full p-1 h-full border rounded shadow-sm'/>
        </Box>
        <Box>
          <Button p={5} colorScheme="linkedin">Search</Button>
        </Box>

      </Box>
    </React.Fragment>
  );
};

export default Reservations;
