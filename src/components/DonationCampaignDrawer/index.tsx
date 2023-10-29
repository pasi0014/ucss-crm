import React, { useState, Suspense } from 'react';

import {
  DrawerCloseButton,
  Button,
  Flex,
  Heading,
  useColorModeValue,
  Box,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody
} from '@chakra-ui/react';
import {
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  Stepper,
  useSteps
} from '@chakra-ui/stepper';
import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons';
import useIsMobile from '../../hooks/useMobile';

import { IMessageBar } from '../MessageBar';
import { DonationCampaign } from '../../data/types/DonationCampaign';

const DonationCampaignForm = React.lazy(() => import('../DonationCampaignForm'));
const DonationCampaignPrices = React.lazy(() => import('../DonationCampaignPrices'));

interface IDonationCampaignDrawerProps {
  donationCampaignId?: number;
  donationCampaign?: DonationCampaign;
  isOpen: boolean;
  onClose: () => void;
  statuses: object;
}
interface IStep {
  description: string;
}

const steps: IStep[] = [
  { description: 'Campaign Info' },
  { description: 'Add Donation Options' },
  { description: 'Change Stauts of Campaign' }
];

const DonationCampaignDrawer: React.FC<IDonationCampaignDrawerProps> = ({
  donationCampaign,
  donationCampaignId,
  onClose,
  isOpen,
  statuses
}) => {
  const [messageBar, setMessageBar] = useState<IMessageBar | null>(null);
  const bg = useColorModeValue('gray.100', 'gray.700');
  const isMobile = useIsMobile();

  const { activeStep, goToNext, goToPrevious, setActiveStep } = useSteps({
    index: 1,
    count: steps.length
  });

  const onDrawerClose = () => {
    setMessageBar(null);
    setActiveStep(1);
    onClose();
  };

  return (
    <Box>
      <Drawer isOpen={isOpen} onClose={onDrawerClose} size="full">
        <DrawerOverlay />
        <DrawerContent bg={bg}>
          <DrawerCloseButton />
          <DrawerHeader>
            <Heading size="xl">Donation Campaign Form</Heading>
          </DrawerHeader>
          <DrawerBody>
            <Box
              border="1px"
              borderColor={{ base: 'transparent', md: useColorModeValue('gray.100', 'gray.400') }}
              p={{ base: '0px', md: '25px' }}
              borderRadius="15px"
              shadow="md"
              bg={useColorModeValue('gray.50', 'gray.600')}
            >
              <Flex flexDirection="column">
                <Stepper index={activeStep} orientation={isMobile ? 'vertical' : 'horizontal'}>
                  {steps.map((step: any, index: number) => (
                    <Step key={index}>
                      <StepIndicator>
                        <StepStatus
                          complete={<StepIcon />}
                          incomplete={<StepNumber />}
                          active={<StepNumber />}
                        />
                      </StepIndicator>

                      <Box flexShrink="0">
                        <StepDescription>{step.description}</StepDescription>
                      </Box>

                      {!isMobile && <StepSeparator />}
                    </Step>
                  ))}
                </Stepper>

                {activeStep === 1 && (
                  <Suspense fallback={<div>Loading...</div>}>
                    <DonationCampaignForm
                      campaignId={donationCampaignId}
                      onNext={() => goToNext()}
                    />
                  </Suspense>
                )}
                {activeStep === 2 && (
                  <Suspense fallback={<div>Loading...</div>}>
                    <DonationCampaignPrices donationCampaignId={donationCampaignId} />
                  </Suspense>
                )}

                <Flex mt="15px">
                  {activeStep !== 1 && (
                    <Button onClick={goToPrevious}>
                      Previuos
                      <ArrowLeftIcon ml="15px" width="15px" />
                    </Button>
                  )}
                  {activeStep !== 3 && (
                    <Button ml={activeStep !== 1 ? '15px' : '0px'} onClick={goToNext}>
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
    </Box>
  );
};

export default DonationCampaignDrawer;
