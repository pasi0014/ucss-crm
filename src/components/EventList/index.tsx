import React, { useState } from 'react';
import moment from 'moment';
import {
  Heading,
  Text,
  Badge,
  Button,
  Box,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiUsers } from 'react-icons/fi';

import { Event } from '../../data/types/Event';
import { getStatus, getStatusColor } from '../../utils/utilities';

interface IEventList {
  events: Event[];
  onEdit: (event: Event) => void;
  onOpen: (event: Event) => void;
  statuses: any;
}

const EventList: React.FC<IEventList> = ({
  events,
  statuses,
  onOpen,
  onEdit,
}) => {
  const eventDateBG = useColorModeValue('blue.600', 'blue.900');
  const eventDateColor = useColorModeValue('orange.200', 'orange.300');
  const muted = useColorModeValue('gray.400', 'gray.500');
  const cardBg = useColorModeValue('white', 'gray.600');
  const itemsPerPage = 5; // Number of items per page
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate start and end indexes for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Slice the events array to display only the events for the current page
  const eventsForCurrentPage = events.slice(startIndex, endIndex);

  // Function to handle previous page click
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Function to handle next page click
  const handleNextPage = () => {
    if (endIndex < events.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="flex flex-col rounded">
      {eventsForCurrentPage.map((iEvent) => (
        <Box
          key={iEvent.id}
          bg={cardBg}
          className="flex md:flex-row flex-col items-center items-top justify-between rounded-xl shadow justify-between mb-5 p-3"
        >
          {/* Title and image */}
          <div className="flex flex-col md:flex-row h-full  w-full sm:p-0 p-1">
            {iEvent.imageURL ? (
              <img
                src={iEvent.imageURL}
                className="md:w-72 w-full h-auto p-2 mr-3 rounded-xl"
                alt="test"
              />
            ) : (
              <Box
                className="md:w-80 h-92 w-full items-center p-16 mr-5 lg:ml-2 rounded-lg flex flex-col text-center"
                bg={eventDateBG}
                color={eventDateColor}
              >
                <div className="font-bold text-3xl">
                  {moment(iEvent.startTime).format('ddd')}
                </div>
                <div className="font-medium text-lg">
                  {moment(iEvent.startTime).format('MMMM D, YYYY')}
                </div>
              </Box>
            )}
            <div className="ml-3 w-8/12">
              {/* Date and Location */}
              <Heading size="md" className="my-3">
                {iEvent.name}
              </Heading>
              <Box my="2" className="flex flex-row items-center">
                {/* <FaLocationDot size={14} className="mr-2" /> */}
                <Text color={muted}>{iEvent.location}</Text>
              </Box>
              <Box my="2" className="flex flex-row items-center">
                {/* <BsClock className="mr-2" /> */}
                <Text color={muted}>
                  {iEvent.endTime
                    ? `${moment(iEvent.startTime).format(
                        'MMMM, D HH:mm',
                      )} - ${moment(iEvent.endTime).format('MMMM, D HH:mm')}`
                    : `${moment(iEvent.startTime).format('MMMM, D HH:mm')}`}
                </Text>
              </Box>
              <div className="flex flex-row w-12/12 w-full sm:p-0  md:items-center">
                <div className="flex flex-row items-center mb-5">
                  <span className="flex flex-row items-center">
                    <FiUsers className="mr-3" />
                    <b>{iEvent.capacity}</b>
                  </span>
                </div>
                <div className="md:w-6/12 w-full sm:p-0 ml-1 md:text-center mb-5">
                  <Badge
                    fontSize="0.8em"
                    colorScheme={getStatusColor(
                      getStatus(statuses.Event, iEvent.StatusId).tag || '',
                    )}
                  >
                    {getStatus(statuses.Event, iEvent.StatusId).tag}
                  </Badge>
                </div>
              </div>
              <div className="mt-4 w-full flex flex-row justify-center">
                <Button
                  className="md:w-full w-6/12 md:mb-5"
                  size="sm"
                  borderRadius="10px"
                  colorScheme="orange"
                  onClick={() => onEdit(iEvent)}
                >
                  Edit
                </Button>
                <Button
                  className="md:w-full w-6/12 mx-3"
                  borderRadius="10px"
                  size="sm"
                  colorScheme="green"
                  onClick={() => onOpen(iEvent)}
                >
                  Open
                </Button>
              </div>
            </div>
            <Box className="w-4/12 flex justify-end font-bold my-3 md:flex hidden">
              {moment(iEvent.startTime).format('ddd • MMMM DD')}
            </Box>
          </div>
        </Box>
      ))}
      {/* Pagination buttons */}
      <div className="flex justify-center">
        <Button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="mr-5 lg:w-4/12 w-full"
          variant={'solid'}
          colorScheme={'linkedin'}
        >
          Previous Page
        </Button>
        <Button
          onClick={handleNextPage}
          disabled={endIndex >= events.length}
          className="ml-5 lg:w-4/12 w-full"
          variant={'solid'}
          colorScheme={'linkedin'}
        >
          Next Page
        </Button>
      </div>
    </div>
  );
};

export default EventList;
