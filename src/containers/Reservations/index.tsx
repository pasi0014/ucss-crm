import React, { useState } from 'react';
import { Heading } from '@chakra-ui/react';
import { Flex } from '@chakra-ui/react';
import { Icon } from '@chakra-ui/react';
import { Button } from '@chakra-ui/react';
import { useColorModeValue } from '@chakra-ui/react';
import { Box } from '@chakra-ui/react';

import { AddIcon } from '@chakra-ui/icons';

const Reservations: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleOpenDrawer = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  return (
    <React.Fragment>
      <Box textAlign="left" my={5} p={3}>
        <Heading>Reservations</Heading>
      </Box>

      <Box bg={useColorModeValue('white', 'gray.700')} px={4} borderRadius="15px" boxShadow="base">
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <Flex alignItems={'center'}>
            <Button variant={'solid'} colorScheme={'teal'} size={'md'} mr={4} onClick={handleOpenDrawer}>
              <AddIcon boxSize={3} mr={3} /> Create an Reservation
            </Button>
          </Flex>
        </Flex>
      </Box>
    </React.Fragment>
  );
};

export default Reservations;
