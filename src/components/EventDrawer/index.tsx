import React, { useEffect, useState } from 'react';
import { Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, Heading, useColorModeValue, Box, Flex } from '@chakra-ui/react';

import { Step, StepDescription, StepIcon, StepIndicator, StepNumber, StepSeparator, StepStatus, StepTitle, Stepper, useSteps } from '@chakra-ui/stepper';
import { Button } from '@chakra-ui/react';

import { Event } from '../../types';
import { EventForm } from './EventForm';
import { PriceInfo } from './PriceInfo';
import { PublishEvent } from './PublishEvent';

import useMobile from '../../hooks/useMobile';

interface IEventFormDrawerProps {
  event?: Event;
  eventId?: number | null;
  isOpen: boolean;
  onClose: () => void;
  variant?: 'circles' | 'circles-alt' | 'simple' | undefined;
}

interface IStep {
  title: string;
  description: string;
}

const steps: IStep[] = [
  { title: 'First', description: 'Event Info' },
  { title: 'Second', description: 'Price' },
  { title: 'Third', description: 'Publish the event' },
  { title: 'Final', description: 'Event is ready' },
];

const EventFormDrawer = (props: IEventFormDrawerProps) => {
  const [messageBar, setMessageBar] = useState<any>({});

  const [eventStatus, setEventStatus] = useState<any>(null);

  const { activeStep, goToNext, goToPrevious, setActiveStep } = useSteps({
    index: 1,
    count: steps.length,
  });

  const isMobile = useMobile();

  const isLastStep = activeStep === steps.length - 1;
  const hasCompletedAllSteps = activeStep === steps.length;
  const bg = useColorModeValue('gray.100', 'gray.700');

  const onDrawerClose = () => {
    setMessageBar({});
    setActiveStep(1);
    props.onClose();
  };

  return (
    <>
      <Drawer isOpen={props.isOpen} onClose={onDrawerClose} size="xl">
        <DrawerOverlay />
        <DrawerContent bg={bg}>
          <DrawerCloseButton />
          <DrawerHeader>
            <Heading size="xl">Create an event</Heading>
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
                {activeStep === 1 && <EventForm onNext={() => goToNext()} eventId={props.eventId} onEventStatusUpdate={setEventStatus} />}
                {activeStep === 2 && <PriceInfo onNext={() => goToNext()} eventId={props.eventId} />}
                {activeStep === 3 && <PublishEvent onNext={goToNext} entity="Event" eventStatus={eventStatus} />}
                {hasCompletedAllSteps && (
                  <Box sx={{ bg, my: 8, p: 8, rounded: 'md' }}>
                    <Heading fontSize="xl" textAlign={'center'}>
                      You have successfully created an Event! 🎉
                    </Heading>
                  </Box>
                )}
                <Flex mt="15px">
                  {!hasCompletedAllSteps && (
                    <Button mr="15px" onClick={goToNext}>
                      Next
                    </Button>
                  )}

                  {activeStep !== 1 && <Button onClick={goToPrevious}>Previuos</Button>}
                </Flex>
              </Flex>
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default EventFormDrawer;
