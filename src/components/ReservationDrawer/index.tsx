import React, { useContext, useState } from 'react';

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  useColorModeValue,
  Heading,
  DrawerCloseButton,
  DrawerOverlay,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Box,
  Flex,
  Button,
  useToast,
} from '@chakra-ui/react';
import { Step, StepDescription, StepIcon, StepIndicator, StepNumber, StepSeparator, StepStatus, StepTitle, Stepper, useSteps } from '@chakra-ui/stepper';
import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons';

import { AppContext } from '../../context/AppContext';
import useIsMobile from '../../hooks/useMobile';

import { Reservation } from '../../types/Reservation';
import { IMessageBar } from '../MessageBar';

import { postLightReservation, putDraftReservation } from './calls';

import ReservationForm from '../ReservationForm';
import ReservationSummary from '../ReservationSummary';
import PaymentReview from '../PaymentReview';

interface IReservationDrawerProps {
  eventId: number | undefined;
  isOpen: boolean;
  reservationId?: string | undefined;
  onClose: () => void;
  variant?: 'circles' | 'circles-alt' | 'simple' | undefined;
}

interface IStep {
  title: string;
  description: string;
}

const steps: IStep[] = [
  { title: '', description: 'Personal Information and Tickets' },
  { title: '', description: 'Review and Payment' },
];

const ReservationDrawer: React.FC<IReservationDrawerProps> = ({ eventId, isOpen, onClose, variant }) => {
  const { isOpen: isModalOpen, onOpen: openModal, onClose: closeModal } = useDisclosure();
  const { setAppLoading } = useContext<any>(AppContext);
  const toast = useToast();
  const [messageBar, setMessageBar] = useState<IMessageBar | null>(null);
  const [reservation, setReservation] = useState<Reservation>({
    EventId: eventId,
    OwnerId: '',
    ClientLists: [],
  });
  const { activeStep, goToNext, goToPrevious, setActiveStep } = useSteps({
    index: 1,
    count: steps.length,
  });

  const isMobile = useIsMobile();
  const bg = useColorModeValue('gray.100', 'gray.700');
  const onDrawerClose = () => {
    setMessageBar(null);
    setActiveStep(1);
    onClose();
  };

  const handleNextClick = () => {
    if (!reservation.ClientLists?.length) {
      toast({
        title: 'Warning',
        description: 'Please make sure you have added at least 1 Client to the reservation.',
        position: 'top-left',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    const clientWithoutTicket = reservation.ClientLists?.find((iClient) => !iClient.Price);
    if (clientWithoutTicket) {
      // If at least one client doesn't have a ticket selected, display a message or perform an action
      toast({
        title: 'Warning',
        description: 'Please make sure you have selected a ticket for all reservation clients.',
        position: 'top-left',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
    } else {
      // All clients that have a ticket selected, proceed to the next step
      if (!reservation.id) {
        createDraftReservation();
      } else {
        updateDraftReservation();
      }
    }
  };

  const updateDraftReservation = async () => {
    setAppLoading(true);
    setMessageBar(null);

    try {
      const response = await putDraftReservation(reservation);
      if (response.success) {
        toast({
          title: 'Success',
          description: 'Reservation has been updated successfully',
          position: 'top-left',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        const updatedReservation: Reservation = { ...reservation, StatusId: response.data.StatusId };
        goToNext();
      } else {
        toast({
          title: 'Error',
          description: response.data,
          position: 'top-left',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error: any) {
      console.error(`Unexpected error :: ${error.message}`);
      setMessageBar({ type: 'error', message: error.message });
    }
    setAppLoading(false);
  };

  const createDraftReservation = async () => {
    setAppLoading(true);
    setMessageBar(null);

    try {
      const response = await postLightReservation(reservation);

      if (response.success) {
        toast({
          title: 'Success',
          description: 'Reservation has been successfully saved',
          position: 'top-left',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        const updatedReservation: Reservation = { ...reservation, ...response.data };
        console.log({ updatedReservation });
        setReservation(updatedReservation);
        goToNext();
      } else {
        toast({
          title: 'Error',
          description: response.data,
          position: 'top-left',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error: any) {
      console.error(`Error : ${error.message}`);
      setMessageBar({ type: 'error', message: error.message });
    }

    setAppLoading(false);
  };

  const handleCloseClick = () => {
    closeModal();
    // Reset reservation state to its initial values
    setReservation({
      EventId: eventId,
      OwnerId: '',
      ClientLists: [],
    });
    setActiveStep(1);
    // Close the drawer
    onClose();
  };

  return (
    <React.Fragment>
      {/* Confirmation modal popup */}
      <Modal isOpen={isModalOpen} onClose={() => closeModal()}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>You are about to close Reservation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to close this window?
            <br /> Reservation Data will be lost.
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={handleCloseClick}>
              Close
            </Button>
            <Button variant="ghost" onClick={() => closeModal()}>
              Exit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Drawer isOpen={isOpen} onClose={() => openModal()} size="xl">
        <DrawerOverlay />
        <DrawerContent bg={bg}>
          <DrawerCloseButton />
          <DrawerHeader>
            <Heading size="xl">Create a Reservation</Heading>
          </DrawerHeader>
          <DrawerBody>
            <Box
              border="1px"
              borderColor={useColorModeValue('gray.100', 'gray.400')}
              p={5}
              borderRadius="15px"
              shadow="md"
              bg={useColorModeValue('gray.50', 'gray.600')}
            >
              <Flex flexDir="column">
                <Stepper index={activeStep} orientation={isMobile ? 'vertical' : 'horizontal'}>
                  {steps.map((step: any, index: number) => (
                    <Step key={index}>
                      <StepIndicator>
                        <StepStatus complete={<StepIcon />} incomplete={<StepNumber />} active={<StepNumber />} />
                      </StepIndicator>

                      <Box flexShrink="0">
                        <StepTitle>{step.title}</StepTitle>
                        <StepDescription>{step.description}</StepDescription>
                      </Box>

                      {!isMobile && <StepSeparator />}
                    </Step>
                  ))}
                </Stepper>
                {/* Stepper Content */}
                {activeStep === 1 && <ReservationForm eventId={eventId} reservation={reservation} onReservationUpdate={setReservation} />}
                {activeStep === 2 && <PaymentReview onReservationUpdate={setReservation} reservation={reservation} onNext={() => goToNext()} />}

                <Flex mt="15px">
                  {activeStep !== 1 && (
                    <Button onClick={goToPrevious}>
                      <ArrowLeftIcon mr="15px" width="15px" />
                      Previuos
                    </Button>
                  )}
                  {activeStep !== 2 && (
                    <Button ml={activeStep !== 1 ? '15px' : '0px'} onClick={eventId && handleNextClick} isDisabled={!eventId}>
                      Next
                      <ArrowRightIcon ml="15px" width="15px" />
                    </Button>
                  )}
                </Flex>
              </Flex>
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </React.Fragment>
  );
};

export default ReservationDrawer;
