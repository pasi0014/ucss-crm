import { AddIcon, Search2Icon } from '@chakra-ui/icons';
import { Heading } from '@chakra-ui/react';
import { InputGroup } from '@chakra-ui/react';
import { useColorModeValue } from '@chakra-ui/react';
import { Button } from '@chakra-ui/react';
import { Input } from '@chakra-ui/react';
import { InputLeftElement } from '@chakra-ui/react';
import { Flex } from '@chakra-ui/react';
import { Box } from '@chakra-ui/react';
import React, { useEffect, useMemo, useState } from 'react';
import DonationCampaignCard from '../../components/DonationCampaignCard';
import withStatusFetching from '../../context/withStatus';
import { getStatus } from '../../utils/utilities';
import { IMessageBar } from '../../components/MessageBar';
import { getDonationCampaigns } from './calls';
import { Fade } from '@chakra-ui/react';
import { ScaleFade } from '@chakra-ui/react';
import DonationCampaignDrawer from '../../components/DonationCampaignDrawer';
import DonationCampaignStatistics from '../../components/DonationCampaignStatistics';
import { DonationCampaign } from '../../types/DonationCampaign';

const Donations = (props: any) => {
  const [donationCampaigns, setDonationCampaigns] = useState<any[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<any>(null);
  const [selectedDonationCampaign, setSelectedDonationCampaign] = useState<DonationCampaign>();
  const [fetchCampaigns, setFetchCampaigns] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messageBar, setMessageBar] = useState<IMessageBar | null>(null);

  const statusItems = useMemo(() => {
    if (props.statuses) {
      return Object.keys(props.statuses.DonationCampaign).map((statusKey) => ({
        key: props.statuses.DonationCampaign[statusKey],
        text: getStatus(props.statuses.DonationCampaign, props.statuses.DonationCampaign[statusKey]).tag,
      }));
    }
  }, [props.statuses]);

  const handleOpenDrawer = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    // setSelectedEventId(null);
    setFetchCampaigns(true);
  };

  const doFetchDonationCampaigns = async () => {
    setLoading(true);
    setMessageBar(null);
    setFetchCampaigns(false);

    try {
      const response = await getDonationCampaigns();
      if (!response.success) {
        throw new Error(response.data);
      }
      setDonationCampaigns(response.data);
    } catch (error: any) {
      console.error(`Error :: ${error.message}`, { ...error });
      setMessageBar({ type: 'error', message: error.message });
    }

    setLoading(false);
  };

  useEffect(() => {
    if (fetchCampaigns) doFetchDonationCampaigns();
  }, [fetchCampaigns]);

  useEffect(() => {
    if (props.statuses) {
      doFetchDonationCampaigns();
    }
  }, [props.statuses]);

  return (
    <Box>
      <Box textAlign="left" my={5} p={3}>
        <Heading>Donation Campaigns</Heading>
      </Box>

      <Flex direction={{ base: 'column', lg: 'row' }} className="w-full h-full" my={15}>
        <Box className="lg:w-6/12 w-full" mr={{ base: 0, md: 10 }} my={2}>
          <InputGroup>
            <InputLeftElement>
              <Search2Icon color="gray.300" />
            </InputLeftElement>
            <Input type="text" bg={useColorModeValue('white', 'gray.700')} placeholder={`Search`} />
          </InputGroup>
        </Box>

        <Box className="lg:w-6/12 w-full flex md:flex-row flex-col">
          <Button onClick={() => console.log('test')} className="w-full md:w-4/12" colorScheme="teal" mt={{ base: 5, md: 2 }} mr={{ base: 0, md: 5 }}>
            <Search2Icon className="mr-2" fontSize={12} />
            <span>Search</span>
          </Button>
          <Button onClick={() => handleOpenDrawer()} className="w-full md:w-8/12" colorScheme="green" my={2}>
            <AddIcon className="mr-2" fontSize={12} />
            <span>Create Donation Campaign</span>
          </Button>
        </Box>
      </Flex>

      <Flex direction={{ base: 'column', md: 'row' }} className="w-full h-full">
        <Flex
          direction="column"
          height="80vh"
          className="lg:w-5/12 w-full overflow-y-scroll scroll-smooth rounded-lg shadow"
          bg={useColorModeValue('white', 'gray.700')}
          p={{ base: 3, sm: 5 }}
          mr={{ base: 0, md: 10 }}
          my={{ base: 5, md: 0 }}
        >
          {props.statuses &&
            donationCampaigns.length > 0 &&
            donationCampaigns.map((iDonationCampaign) => (
              <ScaleFade initialScale={0.8} in={!!donationCampaigns} key={iDonationCampaign.id}>
                <DonationCampaignCard
                  statuses={props.statuses}
                  donationCampaign={iDonationCampaign}
                  onEdit={(id) => console.log({ id })}
                  onArchive={(id) => console.log({ id })}
                  onSelect={setSelectedDonationCampaign}
                />
              </ScaleFade>
            ))}
        </Flex>
        {/* Transform this into drawer when on mobile */}
        <Box className="w-full h-full lg:flex hidden">
          <DonationCampaignStatistics donationCampaign={selectedDonationCampaign} />
        </Box>
      </Flex>
      {props.statuses && (
        <DonationCampaignDrawer isOpen={isDrawerOpen} onClose={handleDrawerClose} donationCampaignId={selectedCampaignId} statuses={props.statuses} />
      )}
    </Box>
  );
};

export default withStatusFetching(Donations);
