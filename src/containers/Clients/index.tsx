import React from 'react';

import { Heading, Box } from '@chakra-ui/react';
import DataTable from '../../components/DataTable';
import ClientsTable from '../../components/ClientsTable';

const Clients = (props: any) => {
  return (
    <React.Fragment>
      <Box textAlign="left" my={5} p={3}>
        <Heading>Clients</Heading>
      </Box>
      <ClientsTable />
    </React.Fragment>
  );
};

export default Clients;
