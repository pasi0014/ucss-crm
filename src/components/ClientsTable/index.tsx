import { Box } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import DataTable from '../DataTable';
import { IColumnProps } from '../../interfaces';
import moment from 'moment';
import Datetime from 'react-datetime';
import { IMessageBar } from '../MessageBar';
import { Spinner } from '@chakra-ui/react';
import { getClients } from './calls';
import { useColorModeValue } from '@chakra-ui/react';
import { Text } from '@chakra-ui/react';
import { InputGroup } from '@chakra-ui/react';
import { Input } from '@chakra-ui/react';
import { InputRightElement } from '@chakra-ui/react';
import { IconButton } from '@chakra-ui/react';
import { AddIcon, CalendarIcon, SearchIcon } from '@chakra-ui/icons';
import { Flex } from '@chakra-ui/react';
import { Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const columns: IColumnProps[] = [
  { header: 'First Name', accessor: 'firstName', render: (value) => <span>{value}</span> },
  { header: 'Last Name', accessor: 'lastName', render: (value) => <span>{value}</span> },
  { header: 'Phone', accessor: 'phone' },
  { header: 'Email', accessor: 'email' },
  { header: 'Created At', accessor: 'createdAt', render: (value) => moment(value).tz('America/Toronto').format('DD MMM, YYYY [at] HH:mma') },
  { header: 'Created By', accessor: 'createdBy' },
];

const ClientsTable = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageBar, setMessageBar] = useState<IMessageBar | null>(null);

  const [searchTerm, setSearchTerm] = useState('');

  const calendarBg = useColorModeValue('white', 'gray.600');
  const wrapperBg = useColorModeValue('white', 'gray.700');
  const inputBg = useColorModeValue('gray.500', 'gray.400');

  const navigate = useNavigate();

  const doFetchClients = async ({ isMounted }: { isMounted: boolean }) => {
    setLoading(true);
    setMessageBar(null);

    try {
      const response = await getClients();
      if (!response.success) {
        throw new Error(response.data);
      }
      setClients(response.data);
    } catch (error: any) {
      console.error(`Error :: ${error.message}`);
      setMessageBar({ type: 'error', message: error.message });
    }
    setLoading(false);
  };

  const handleSearch = (term: string) => {
    console.log({ term });
  };

  const onRenderInput = (props: any, openCalendar: any, closeCalendar: any) => {
    return (
      <Flex direction="row">
        <InputGroup>
          <Input {...props} />
          <InputRightElement>
            <IconButton aria-label="Search" icon={<CalendarIcon />} onClick={() => openCalendar()} />
          </InputRightElement>
        </InputGroup>
      </Flex>
    );
  };

  const renderCalendar = (mode: any, renderDefault: any) => {
    // Only for years, months and days view
    if (mode === 'time') return renderDefault();

    return (
      <Box className="" bg={calendarBg}>
        {renderDefault()}
      </Box>
    );
  };

  const onOpenRecord = (item: any) => {
    navigate(`/clients/${item.id}`);
  };

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      doFetchClients({ isMounted });
    }
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Box>
      <Box bg={wrapperBg} p={3} borderRadius="10px" boxShadow="sm" mb={5}>
        {/* Wrapper */}
        <div className="w-full flex lg:flex-row flex-col items-center">
          {/* Filters */}
          <div className="flex lg:flex-row flex-col lg:space-x-4 w-full">
            <Box className="lg:w-8/12 w-full mb-3 flex flex-col">
              <Text className="text-relaxed font-medium ml-1 mb-2" color={inputBg}>
                Search Client
              </Text>
              <InputGroup>
                <Input
                  bg={wrapperBg}
                  shadow="md"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(val: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(val.target.value)}
                />
                <InputRightElement>
                  <IconButton color={useColorModeValue('gray.600', 'gray.50')} aria-label="Search" icon={<SearchIcon />} onClick={handleSearch} />
                </InputRightElement>
              </InputGroup>
            </Box>
            <div className="w-full flex sm:flex-row flex-col">
              {/* <Flex className="lg:w-4/12 w-full flex flex-col sm:mr-4 m-0">
                <Text className="font-medium ml-1 mb-2" color={inputBg}>
                  Date
                </Text>
                <Datetime
                  inputProps={{ className: 'border-2 p-2 rounded-lg w-full', placeholder: 'Select a date' }}
                  className="border-1 border-gray-600 rounded-lg shadow-sm w-full "
                  renderInput={onRenderInput}
                  timeFormat={false}
                  renderView={renderCalendar}
                  dateFormat={'DD MMM, YYYY'}
                  value={eventDate}
                />
              </Flex> */}
              {/* {statusItems && statusItems.length && (
                <Box className="sm:w-4/12 w-full flex flex-col">
                  <Text className="font-medium ml-1 mb-2" color={inputBg}>
                    Status
                  </Text>
                  <Select
                    placeholder="Select a status"
                    className="text-gray-400"
                    value={selectedStatus}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      setSelectedStatus(e.target.value);
                    }}
                  >
                    {statusItems.map((status: any) => (
                      <option key={status.key} value={status.key}>
                        {status.text}
                      </option>
                    ))}
                  </Select>
                </Box>
              )} */}
            </div>
          </div>

          <div className="lg:w-4/12 justify-end w-full mt-3 flex sm:flex-row flex-col">
            <Button variant={'solid'} colorScheme={'blue'} size={'md'} mr={4} onClick={() => console.log('open')} my={{ base: 5, sm: 15 }}>
              <SearchIcon boxSize={3} mr={3} />
              Search
            </Button>
            <Button variant={'solid'} colorScheme={'teal'} size={'md'} mr={4} onClick={() => console.log('hey')} my={{ base: 5, sm: 15 }}>
              <AddIcon boxSize={3} mr={3} />
              Create Client
            </Button>
          </div>
        </div>
      </Box>
      {loading && (
        <div className="flex justify-center">
          <Spinner />
        </div>
      )}
      {!!clients.length && <DataTable items={clients} columns={columns} onOpenRecord={onOpenRecord} />}
    </Box>
  );
};

export default ClientsTable;
