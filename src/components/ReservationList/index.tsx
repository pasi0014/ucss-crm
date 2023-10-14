import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { Reservation } from '../../data/types/Reservation';
import { getEventReservation } from '../../containers/EventView/calls';
import { IMessageBar } from '../MessageBar';
import {
  Button,
  useColorModeValue,
  IconButton,
  InputRightElement,
  Input,
  InputGroup,
  Text,
  Spinner,
  Box,
} from '@chakra-ui/react';
import withStatusFetching from '../../context/withStatus';

import { AddIcon, SearchIcon } from '@chakra-ui/icons';
import { getStatus, getStatusColor } from '../../utils/utilities';
import { Select } from '@chakra-ui/react';
import { IColumnProps } from '../../interfaces';
import { Badge } from '@chakra-ui/react';
import moment from 'moment';
import DataTable from '../DataTable';
const QRScanner = React.lazy(() => import('../QRScanner'));

interface ReservationListProps {
  eventId: number;
  onOpen?: (reservation: any) => void;
  onCreate?: () => void;
  statuses: any;
}

/**
 *  1. Add filtering and search
 *  2. Create a custom table for a reservation
 *      - host name
 *      - host email / phone
 *      - people on reservation
 *      - status
 *      - created at
 */
const ReservationList: React.FC<ReservationListProps> = ({
  eventId,
  statuses,
  onOpen,
  onCreate,
}) => {
  const [reservations, setReservations] = useState<Array<any>>([]);
  const [filteredReservations, setFilteredReservations] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [messageBar, setMessageBar] = useState<IMessageBar | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<any>('');
  const [reservationCode, setReservationCode] = useState('');

  const columns: IColumnProps[] = [
    { header: 'ID', accessor: 'id' },
    {
      header: 'Host Name',
      accessor: 'ClientLists',
      render: (ClientLists) => {
        const owner = ClientLists.find((iClient: any) =>
          reservations.find(
            (iReservation: Reservation) =>
              iReservation.OwnerId === iClient.ClientId,
          ),
        ).Client;
        return `${owner.firstName} ${owner.lastName}`;
      },
    },
    {
      header: 'Host Phone',
      accessor: 'OwnerId',
      render: (OwnerId) => {
        const owner = reservations.find((iReservation: Reservation) =>
          iReservation.ClientLists.find(
            (iCLientList: any) => iCLientList.Client.id === OwnerId,
          ),
        ).ClientLists;
        const client = owner.find(
          (iClient: any) => iClient.Client.id === OwnerId,
        );
        return `${client.Client.phone}`;
      },
    },
    {
      header: 'Host Email',
      accessor: 'OwnerId',
      render: (OwnerId) => {
        const owner = reservations.find((iReservation: Reservation) =>
          iReservation.ClientLists.find(
            (iCLientList: any) => iCLientList.Client.id === OwnerId,
          ),
        ).ClientLists;
        const client = owner.find(
          (iClient: any) => iClient.Client.id === OwnerId,
        );
        return `${client.Client.email}`;
      },
    },
    {
      header: 'Status',
      accessor: 'StatusId',
      render: (value) => (
        <Badge
          colorScheme={getStatusColor(
            getStatus(statuses.Reservation, value).tag || '',
          )}
        >
          {getStatus(statuses.Reservation, value).tag}
        </Badge>
      ),
    },
    {
      header: 'Created At',
      accessor: 'createdAt',
      render: (value) =>
        moment(value).tz('America/Toronto').format('YYYY-MM-DD HH:mm'),
    },
    { header: 'Created By', accessor: 'createdBy' },
  ];

  const wrapperBg = useColorModeValue('white', 'gray.700');
  const inputBg = useColorModeValue('gray.500', 'gray.400');

  const handleSearch = () => {
    // Convert the searchTerm to lowercase just once to avoid multiple conversions
    const searchTermLower = searchTerm.toLowerCase();

    // Use the Array.prototype.filter method to filter the reservations array
    const filteredItems = reservations.filter((iReservation: Reservation) => {
      // Use the Array.prototype.some method to check if any client's name contains the searchTerm
      return iReservation.ClientLists.some((iClientList) => {
        if (reservationCode.length > 0) {
          return iClientList.reservationCode === reservationCode;
        }
        // TODO: if reservationCode State is set, skip Client search and filter by iClientList.reservationCode else continue with the regular flow
        // Extract the client's name and convert it to lowercase for comparison
        const clientName = Object.values(iClientList.Client)
          .join(' ')
          .toLowerCase();

        // Check if the client's name contains the searchTermLower
        return clientName.includes(searchTermLower);
      });
    });
    // Update the filtered reservations state
    setFilteredReservations(filteredItems);
  };

  const doFetchEventReservations = async (eventId: number) => {
    setLoading(true);

    try {
      const response = await getEventReservation(eventId);
      if (!response.success) {
        throw new Error(response.data);
      }
      setReservations(response.data);
      setFilteredReservations(response.data);
    } catch (error: any) {
      console.error(`Unepxected error : ${error.message}`);
      setMessageBar({ type: 'error', message: error.message });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (eventId) {
      doFetchEventReservations(eventId);
    }
  }, [eventId]);

  useEffect(() => {
    if (searchTerm.length === 0) {
      setFilteredReservations(reservations);
    } else {
      handleSearch();
    }
  }, [searchTerm, selectedStatus]);

  return (
    <div className="w-full h-full">
      {loading && (
        <div className="flex justify-center">
          <Spinner size="md" />
        </div>
      )}
      <Box bg={wrapperBg} py={3} mb={5}>
        {/* Wrapper */}
        <div className="w-full flex lg:flex-row flex-col items-center">
          {/* Filters */}
          <div className="flex lg:flex-row flex-col lg:space-x-4 w-full">
            <Box className="lg:w-8/12 w-full mb-3 flex flex-col">
              <Text
                className="text-relaxed font-medium ml-1 mb-2"
                color={inputBg}
              >
                Search reservation
              </Text>
              <InputGroup>
                <Input
                  bg={wrapperBg}
                  shadow="md"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(val: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchTerm(val.target.value)
                  }
                />
                <InputRightElement>
                  <IconButton
                    color={useColorModeValue('gray.600', 'gray.50')}
                    aria-label="Search"
                    icon={<SearchIcon />}
                    onClick={handleSearch}
                  />
                </InputRightElement>
              </InputGroup>
            </Box>
          </div>

          <div className="lg:w-6/12 w-full justify-end w-full mt-3 flex sm:flex-row flex-col">
            <Button
              variant={'solid'}
              colorScheme={'blue'}
              size={{ base: 'sm', md: 'md' }}
              mr={4}
              onClick={handleSearch}
              my={{ base: 5, sm: 15 }}
            >
              <SearchIcon boxSize={3} mr={3} />
              Search
            </Button>
            <Box my={{ base: 5, sm: 15 }} mr={5}>
              <Suspense fallback={<>loading...</>}>
                <QRScanner
                  onSuccess={(reservationCode) => {
                    setReservationCode(reservationCode);
                    setSearchTerm(reservationCode);
                  }}
                />
              </Suspense>
            </Box>

            <Button
              variant={'solid'}
              colorScheme={'green'}
              size={{ base: 'sm', md: 'md' }}
              onClick={onCreate}
              my={{ base: 5, sm: 15 }}
              mr={5}
            >
              <AddIcon boxSize={3} mr={3} />
              Create a Reservation
            </Button>
          </div>
        </div>
      </Box>

      <DataTable
        columns={columns}
        items={filteredReservations}
        onOpenRecord={onOpen}
      />
    </div>
  );
};

export default withStatusFetching(ReservationList);
