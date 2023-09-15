import React, { useState } from 'react';
import { Heading } from '@chakra-ui/react';
import { Flex } from '@chakra-ui/react';
import { Icon } from '@chakra-ui/react';
import { Button } from '@chakra-ui/react';
import { useColorModeValue } from '@chakra-ui/react';
import { Box } from '@chakra-ui/react';

import { AddIcon } from '@chakra-ui/icons';
import ReservationList from '../../components/ReservationList';

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
    </React.Fragment>
  );
};

export default Reservations;
