import { Drawer } from '@chakra-ui/react';
import { DrawerContent } from '@chakra-ui/react';
import { DrawerHeader } from '@chakra-ui/react';
import { DrawerBody } from '@chakra-ui/react';
import { useColorModeValue } from '@chakra-ui/react';
import { Heading } from '@chakra-ui/react';
import { DrawerCloseButton } from '@chakra-ui/react';
import { DrawerOverlay } from '@chakra-ui/react';
import { Modal } from '@chakra-ui/react';
import { ModalOverlay } from '@chakra-ui/react';
import { ModalContent } from '@chakra-ui/react';
import { ModalHeader } from '@chakra-ui/react';
import { ModalCloseButton } from '@chakra-ui/react';
import { ModalBody } from '@chakra-ui/react';
import { ModalFooter } from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/react';
import { Box } from '@chakra-ui/react';
import { Step, StepDescription, StepIcon, StepIndicator, StepNumber, StepSeparator, StepStatus, StepTitle, Stepper, useSteps } from '@chakra-ui/stepper';
import React, { useState } from 'react';
import useIsMobile from '../../hooks/useMobile';
import { Flex } from '@chakra-ui/react';
import { Button } from '@chakra-ui/react';
import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons';
import ReservationForm from '../ReservationForm';
import { Reservation } from '../../types/Reservation';
import { useToast } from '@chakra-ui/react';
import PaymentInformation from '../PaymentInformation';
import ReservationSummary from '../ReservationSummary';

interface IReservationDrawerProps {
  eventId: number;
  isOpen: boolean;
  onClose: () => void;
  variant?: 'circles' | 'circles-alt' | 'simple' | undefined;
}

interface IStep {
  title: string;
  description: string;
}

const steps: IStep[] = [
  { title: '', description: 'Personal Information and Tickets' },
  { title: '', description: 'Payment' },
  { title: '', description: 'Confirmation' },
];

const ReservationDrawer: React.FC<IReservationDrawerProps> = ({ eventId, isOpen, onClose, variant }) => {
  const { isOpen: isModalOpen, onOpen: openModal, onClose: closeModal } = useDisclosure();
  const toast = useToast();
  const [messageBar, setMessageBar] = useState<any>({});
  const [reservation, setReservation] = useState<Reservation>({
    EventId: eventId,
    OwnerId: '',
    Clients: [],
    pendingPayments: [],
  });

  const { activeStep, goToNext, goToPrevious, setActiveStep } = useSteps({
    index: 1,
    count: steps.length,
  });

  const isMobile = useIsMobile();
  const bg = useColorModeValue('gray.100', 'gray.700');
  const onDrawerClose = () => {
    setMessageBar({});
    setActiveStep(1);
    onClose();
  };

  const handleNextClick = () => {
    if (!reservation.Clients?.length) {
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
    const clientWithoutTicket = reservation.Clients.find((iClient) => !iClient.Price);
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
      // All clients have a ticket selected, proceed to the next step
      goToNext();
    }
  };

  const handleCloseClick = () => {
    closeModal();
    // Reset reservation state to its initial values
    setReservation({
      EventId: eventId,
      OwnerId: '',
      Clients: [],
    });
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
                {activeStep === 2 && <PaymentInformation onReservationUpdate={setReservation} reservation={reservation} onNext={() => goToNext()} />}
                {activeStep === 3 && <ReservationSummary />}

                <Flex mt="15px">
                  {activeStep !== 1 && (
                    <Button onClick={goToPrevious}>
                      Previuos
                      <ArrowLeftIcon ml="15px" width="15px" />
                    </Button>
                  )}
                  {activeStep !== 3 && (
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
