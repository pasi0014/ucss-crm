import React from 'react';
import moment from 'moment';
import { Badge, Box, useColorModeValue, Image, Button, Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel } from '@chakra-ui/react';
import { FaPhone, FaTrash } from 'react-icons/fa';
import { MdModeEdit, MdEmail } from 'react-icons/md';
import { IoTicketSharp } from 'react-icons/io5';

import { ClientList } from '../../types/Reservation';
import { getStatus, getStatusColor } from '../../utils/utilities';

import { QRCodeSVG } from 'qrcode.react';
import { CheckIcon } from '@chakra-ui/icons';

interface IGuestCard {
  clientList: ClientList;
  onClose?: (itemId: number) => void;
  onEdit?: (item: any) => void;
  statuses?: any;
}

function generateInitias(firstName: string = '', lastName: string = '') {
  const firstInitial = firstName.charAt(0).toUpperCase();
  const lastInitial = lastName.charAt(0).toUpperCase();

  return `${firstInitial}${lastInitial}`;
}

const GuestCard: React.FC<IGuestCard> = ({ statuses, clientList, onClose, onEdit }) => {
  return (
    <Box className="flex flex-col rounded-xl shadow-md p-3" bg={useColorModeValue('gray.50', 'gray.600')}>
      {/* Details with QR */}
      <div className="flex sm:flex-row flex-col justify-space-between">
        <Box
          className="hidden sm:inline-flex items-center justify-center rounded-full shadow-sm h-10 w-10 mr-3 text-sm font-bold"
          bg={useColorModeValue('blue.100', 'blue.300')}
        >
          {generateInitias(clientList.Client?.firstName, clientList.Client.lastName)}
        </Box>
        <div className="flex flex-col sm:w-4/12 w-full space-y-2">
          <div>{`${clientList.Client.firstName} ${clientList.Client.lastName}`}</div>
          <div className="text-xs flex flex-row items-center">
            <FaPhone className="mr-2" />
            <span>{clientList.Client.phone}</span>
          </div>
          <div className="text-xs flex flex-row items-center">
            <MdEmail className="mr-2 text-md" />
            <span>{clientList.Client.email}</span>
          </div>
          <div className="text-xs flex flex-row items-center">
            Status:{' '}
            <Badge className="ml-2" colorScheme={getStatusColor(getStatus(statuses.ClientList, clientList.StatusId).tag || '')}>
              {getStatus(statuses.ClientList, clientList.StatusId).tag}
            </Badge>
          </div>
          <div className="text-xs flex flex-row items-center">
            <span>Created: </span>
            <span className="ml-1">{moment(clientList.createdAt).tz('America/Toronto').utc().format('DD MMM, YYYY [at] HH:mm')}</span>
          </div>
        </div>
        <div className="flex flex-row sm:w-4/12 w-full sm:my-auto my-5 h-full items-center align-baseline text-base">
          <IoTicketSharp className="mr-2" />{' '}
          <span>
            {clientList.Price?.name} | {clientList.Price?.ticketType === 'free' ? 'Free' : `${clientList.Price?.amount}`}
          </span>
        </div>
        <div className="flex flex-col justify-end mx-auto p-1">
          <QRCodeSVG value={clientList.reservationCode || ''} size={96} className="mx-auto" />
          <span className="text-center text-xs mt-2">ReservationCode: {clientList.reservationCode}</span>
        </div>
      </div>
      {/* Tickets info */}
      <div className="flex sm:flex-row flex-col">
        <div className="flex flex-row justify-start p-3 sm:w-8/12 w-full">
          <Button className="mt-2 sm:w-6/12 w-full  mr-2" colorScheme="green" size={{ base: 'xs', md: 'sm' }}>
            <CheckIcon className="mr-2" /> Check in
          </Button>
        </div>
        <div className="flex flex-row justify-end p-3 sm:w-8/12 w-full">
          <Button className="mt-2 sm:w-6/12 w-full mr-2" colorScheme="orange" size={{ base: 'xs', md: 'sm' }}>
            <MdModeEdit className="mr-2" /> Edit
          </Button>
          <Button className="mt-2 sm:w-6/12 w-full" colorScheme="red" size={{ base: 'xs', md: 'sm' }}>
            <FaTrash className="mr-2" /> Delete Guest
          </Button>
        </div>
      </div>
      {/* Guest Activity */}
      {/* <div>
        <Accordion allowMultiple>
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  Section 1 title
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
              veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </div> */}
    </Box>
  );
};

export default GuestCard;
