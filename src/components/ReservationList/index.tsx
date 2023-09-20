import React, { useState, useEffect, useMemo } from 'react';
import { Reservation } from '../../types/Reservation';
import { getEventReservation } from '../../containers/EventView/calls';
import { IMessageBar } from '../MessageBar';
import {
  Button,
  Flex,
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

import { AddIcon, CalendarIcon, SearchIcon } from '@chakra-ui/icons';
import { getStatus, getStatusColor } from '../../utils/utilities';
import { Select } from '@chakra-ui/react';
import { IColumnProps } from '../../interfaces';
import { Badge } from '@chakra-ui/react';
import moment from 'moment';
import DataTable from '../DataTable';

interface ReservationListProps {
  eventId: number;
  reservationCode?: string;
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
  reservationCode = '',
  onOpen,
  onCreate,
}) => {
  const [reservations, setReservations] = useState<Array<any>>([]);
  const [filteredReservations, setFilteredReservations] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [messageBar, setMessageBar] = useState<IMessageBar | null>(null);
  const [searchTerm, setSearchTerm] = useState(reservationCode);
  const [selectedStatus, setSelectedStatus] = useState<any>('');

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
    const filteredItems: Reservation[] = [];
    reservations.forEach((iReservation: Reservation) => {
      iReservation.ClientLists.forEach((iClientList) => {
        if (
          Object.values(iClientList.Client)
            .join(' ')
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        ) {
          filteredItems.push(iReservation);
        }
      });
    });
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
    } else if (reservationCode.length) {
      setFilteredReservations(
        reservations.filter(
          (iReservation: Reservation) =>
            iReservation.reservationCode === reservationCode,
        ),
      );
    } else {
      handleSearch();
    }
  }, [searchTerm, selectedStatus, reservationCode]);

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
            {/* <div className="w-full flex sm:flex-row flex-col">
              {statusItems && statusItems.length && (
                <Box className="sm:w-4/12 w-full flex flex-col">
                  <Text className="font-medium ml-1 mb-2" color={inputBg}>
                    Status
                  </Text>
                  <Select
                    key={crypto.randomUUID()}
                    placeholder="Select a status"
                    className={`shadow-md ${selectedStatus} ? 'text-gray-700' : 'text-gray-400'`}
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
              )}
            </div> */}
          </div>

          <div className="lg:w-4/12 justify-end w-full mt-3 flex sm:flex-row flex-col">
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
