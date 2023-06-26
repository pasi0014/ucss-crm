import { Drawer } from '@chakra-ui/react';
import { DrawerContent } from '@chakra-ui/react';
import { DrawerHeader } from '@chakra-ui/react';
import { DrawerBody } from '@chakra-ui/react';
import { useColorModeValue } from '@chakra-ui/react';
import { Heading } from '@chakra-ui/react';
import { DrawerCloseButton } from '@chakra-ui/react';
import { DrawerOverlay } from '@chakra-ui/react';
import { Box } from '@chakra-ui/react';
import { Step, StepDescription, StepIcon, StepIndicator, StepNumber, StepSeparator, StepStatus, StepTitle, Stepper, useSteps } from '@chakra-ui/stepper';
import React, { useState } from 'react';
import useIsMobile from '../../hooks/useMobile';
import { Flex } from '@chakra-ui/react';
import { Button } from '@chakra-ui/react';
import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons';
import ReservationForm from '../ReservationForm';

interface IReservationDrawerProps {
  eventId?: number;
  isOpen: boolean;
  onClose: () => void;
  variant?: 'circles' | 'circles-alt' | 'simple' | undefined;
}

interface IStep {
  title: string;
  description: string;
}

const steps: IStep[] = [
  { title: '', description: 'Personal Information' },
  { title: '', description: 'Payment' },
  { title: '', description: 'Confirmation' },
];

const ReservationDrawer = (props: IReservationDrawerProps) => {
  const [messageBar, setMessageBar] = useState<any>({});

  const { activeStep, goToNext, goToPrevious, setActiveStep } = useSteps({
    index: 1,
    count: steps.length,
  });

  const isMobile = useIsMobile();
  const bg = useColorModeValue('gray.100', 'gray.700');
  const onDrawerClose = () => {
    setMessageBar({});
    setActiveStep(1);
    props.onClose();
  };
  return (
    <React.Fragment>
      <Drawer isOpen={props.isOpen} onClose={onDrawerClose} size="xl">
        <DrawerOverlay />
        <DrawerContent bg={bg}>
          <DrawerCloseButton />
          <DrawerHeader>
            <Heading size="xl">Create an Reservation</Heading>
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
                {activeStep === 1 && <ReservationForm />}
                {activeStep === 2 && <>Paymen Here</>}
                {activeStep === 3 && <>Confirmation with Ticket Detail</>}

                <Flex mt="15px">
                  {activeStep !== 1 && (
                    <Button onClick={goToPrevious}>
                      Previuos
                      <ArrowLeftIcon ml="15px" width="15px" />
                    </Button>
                  )}
                  {activeStep !== 3 && (
                    <Button ml={activeStep !== 1 ? '15px' : '0px'} onClick={props.eventId && goToNext} isDisabled={!props.eventId}>
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
