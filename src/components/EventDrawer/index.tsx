import React, { useEffect, useState } from 'react';
import { Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, Heading, useColorModeValue, Box, Flex } from '@chakra-ui/react';

import { Step, StepDescription, StepIcon, StepIndicator, StepNumber, StepSeparator, StepStatus, StepTitle, Stepper, useSteps } from '@chakra-ui/stepper';
import { Button } from '@chakra-ui/react';

import { Event } from '../../types';
// import { EventForm } from './EventForm';
import { PriceInfo } from './PriceInfo';
import { PublishEvent } from './PublishEvent';

import useMobile from '../../hooks/useMobile';
import { EventForm } from '../EventForm';
import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons';

interface IEventFormDrawerProps {
  event?: Event;
  eventId: number | null;
  isOpen: boolean;
  onClose: () => void;
  variant?: 'circles' | 'circles-alt' | 'simple' | undefined;
}

interface IStep {
  description: string;
}

const steps: IStep[] = [{ description: 'Event Info' }, { description: 'Tickets' }, { description: 'Publish the event' }];

const EventFormDrawer = (props: IEventFormDrawerProps) => {
  const [messageBar, setMessageBar] = useState<any>({});
  const [eventId, setEventId] = useState<any>(null);

  const { activeStep, goToNext, goToPrevious, setActiveStep } = useSteps({
    index: 1,
    count: steps.length,
  });

  const isMobile = useMobile();
  const bg = useColorModeValue('gray.100', 'gray.700');

  const onDrawerClose = () => {
    setMessageBar({});
    setActiveStep(1);
    props.onClose();
  };

  const onEventUpdate = (eventId: number) => {
    console.log(`OnEventUpdate`, { eventId });
    setEventId(eventId);
  };

  useEffect(() => {
    console.log({ eventId });
  }, []);

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
                        <StepDescription>{step.description}</StepDescription>
                      </Box>

                      {!isMobile && <StepSeparator />}
                    </Step>
                  ))}
                </Stepper>
                {/* Stepper Content */}
                {activeStep === 1 && <EventForm onNext={() => goToNext()} eventId={props.eventId} onEventUpdate={onEventUpdate} />}
                {activeStep === 2 && <PriceInfo onNext={() => goToNext()} eventId={props.eventId} />}
                {activeStep === 3 && <PublishEvent onNext={goToNext} entity="Event" eventId={props.eventId} />}

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
    </>
  );
};

export default EventFormDrawer;
