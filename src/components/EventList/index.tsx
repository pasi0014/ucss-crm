import React from 'react';
import moment from 'moment';
import { Event } from '../../types/Event';
import { Box } from '@chakra-ui/react';
import { useColorModeValue } from '@chakra-ui/react';
import { BsClock } from 'react-icons/bs';
import { FiUsers } from 'react-icons/fi';
import { Button } from '@chakra-ui/react';
import { Badge } from '@chakra-ui/react';
import { FaLocationDot } from 'react-icons/fa6';
import { Text } from '@chakra-ui/react';
import { getStatus, getStatusColor } from '../../utils/utilities';
import { Heading } from '@chakra-ui/react';

interface IEventList {
  events: Event[];
  onEdit: (event: Event) => void;
  onOpen: (event: Event) => void;
  statuses: any;
}

const EventList: React.FC<IEventList> = ({ events, statuses, onOpen, onEdit }) => {
  const eventDateBG = useColorModeValue('blue.600', 'blue.900');
  const eventDateColor = useColorModeValue('orange.200', 'orange.300');
  const muted = useColorModeValue('gray.400', 'gray.500');
  return (
    <div className="flex flex-col rounded">
      {events.map((iEvent) => (
        <Box
          key={iEvent.id}
          bg={useColorModeValue('white', 'gray.600')}
          className="flex md:flex-row flex-col items-center w-8/12 items-top justify-between rounded-lg shadow justify-between mb-5 p-3"
        >
          {/* Title and image */}
          <div className="flex flex-row  h-full ml-1 w-full sm:p-0 p-1">
            {iEvent.imageURL ? (
              <img src={iEvent.imageURL} className="w-80 h-92 p-2 mr-3 rounded-xl hidden sm:block" alt="test" />
            ) : (
              <Box className="md:w-80 h-92 items-center w-9/12 p-16 mr-5 rounded-lg flex flex-col text-center" bg={eventDateBG} color={eventDateColor}>
                <div className="font-bold text-3xl">{moment(iEvent.startTime).format('ddd')}</div>
                <div className="font-medium text-lg">{moment(iEvent.startTime).format('MMMM D, YYYY')}</div>
              </Box>
            )}
            <div>
              {/* Date and Location */}
              <Heading size="lg" className="my-3">
                {iEvent.name}
              </Heading>
              <Box my="2" className="flex flex-row items-center">
                <FaLocationDot className="mr-2" /> <Text color={muted}>{iEvent.location}</Text>
              </Box>
              <Box my="2" className="flex flex-row items-center">
                <BsClock className="mr-2" />
                <Text color={muted}>
                  {iEvent.endTime
                    ? `${moment(iEvent.startTime).format('MMMM, D HH:mm')} - ${moment(iEvent.endTime).format('MMMM, D HH:mm')}`
                    : `${moment(iEvent.startTime).format('MMMM, D HH:mm')}`}
                </Text>
              </Box>
              <div className="flex flex-row w-12/12 w-full sm:p-0 ml-1 md:items-center">
                <div className="flex flex-row items-center mb-5">
                  <span>Capacity:</span>
                  <span className="flex flex-row items-center">
                    <FiUsers size={28} className="mr-3" />
                    <b>{iEvent.capacity}</b>
                  </span>
                </div>
                <div className="md:w-6/12 w-full sm:p-0 ml-1 md:text-center mb-5">
                  <span className="mx-5 font-medium">Status</span>
                  <Badge fontSize="1em" colorScheme={getStatusColor(getStatus(statuses.Event, iEvent.StatusId).tag || '')}>
                    {getStatus(statuses.Event, iEvent.StatusId).tag}
                  </Badge>
                </div>
              </div>
              <div className="p-3 w-full flex flex-row justify-center">
                <Button className="md:w-full w-6/12 md:mb-5" size="sm" borderRadius="10px" colorScheme="orange" onClick={() => onEdit(iEvent)}>
                  Edit
                </Button>
                <Button className="md:w-full w-6/12 mx-3" borderRadius="10px" size="sm" colorScheme="green" onClick={() => onOpen(iEvent)}>
                  Open
                </Button>
              </div>
            </div>
            <Box className="w-4/12 flex justify-end font-bold my-3">{moment(iEvent.startTime).format('ddd • MMMM DD')}</Box>
          </div>
        </Box>
      ))}
    </div>
  );
};

export default EventList;
