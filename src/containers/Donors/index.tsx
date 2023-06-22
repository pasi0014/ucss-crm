import { useState } from 'react';

import { Flex, Box, useColorModeValue, Button, useDisclosure } from '@chakra-ui/react';
import DataTable from '../../components/DataTable';
import DonorFormDrawer from '../../components/DonorForm';
import { Heading } from '@chakra-ui/react';

const Donors = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
  ];

  const items = [
    { id: '1', name: 'John Doe', email: 'john.doe@example.com' },
    { id: '2', name: 'Jane Doe', email: 'jane.doe@example.com' },
    { id: '3', name: 'Bob Smith', email: 'bob.smith@example.com' },
  ];

  const onOpenRecord = (item: any) => {
    console.log(`Opening record ${item.id}`);
  };

  const onEditRecord = (item: any) => {
    console.log(`Editing record ${item.id}`);
  };

  const handleOpenDrawer = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  return (
    <>
      <Box textAlign="left" my={5} p={3}>
        <Heading>Donors</Heading>
      </Box>
      <Box bg={useColorModeValue('white', 'gray.700')} px={4} width="350px" borderRadius="15px" boxShadow="base">
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <Flex alignItems={'center'}>
            <Button variant={'solid'} colorScheme={'teal'} size={'md'} mr={4} onClick={handleOpenDrawer}>
              Add a donor
            </Button>
          </Flex>
        </Flex>
      </Box>
      <DataTable
        columns={columns}
        items={items}
        onOpenRecord={onOpenRecord}
        onEditRecord={onEditRecord}
        onDeleteRecord={(val) => console.log({ val })}
        dataDescription="Donors"
      />
      <DonorFormDrawer isOpen={isDrawerOpen} onClose={handleDrawerClose} />
    </>
  );
};

export default Donors;
