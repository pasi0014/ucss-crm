import { AddIcon, Search2Icon } from '@chakra-ui/icons';
import { Heading } from '@chakra-ui/react';
import { InputGroup } from '@chakra-ui/react';
import { useColorModeValue } from '@chakra-ui/react';
import React, { useEffect, useMemo, useState } from 'react';
import { ScaleFade, Box, Flex, InputLeftElement, Button, Input } from '@chakra-ui/react';

import { DonationCampaign } from '../../data/types/DonationCampaign';
import { getStatus } from '../../utils/utilities';
import { getDonationCampaigns } from './calls';

import { IMessageBar } from '../../components/MessageBar';
const DonationCampaignDrawer = React.lazy(() => import('../../components/DonationCampaignDrawer'));
import DonationCampaignCard from '../../components/DonationCampaignCard';
import DonationCampaignStatistics from '../../components/DonationCampaignStatistics';

import withStatusFetching from '../../context/withStatus';
import DonorsOverview from '../../components/DonorsOverview';
import { Stat } from '@chakra-ui/react';
import { StatLabel } from '@chakra-ui/react';
import { FaMoneyBill } from 'react-icons/fa';
import { StatNumber } from '@chakra-ui/react';
import { Text } from '@chakra-ui/react';
import { FiUser, FiUsers } from 'react-icons/fi';
import DonationOverview from '../../components/DonationOverview';
import { NavLink, useNavigate } from 'react-router-dom';

const Donations = (props: any) => {
  const [donationCampaigns, setDonationCampaigns] = useState<any[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<any>(null);
  const [selectedDonationCampaign, setSelectedDonationCampaign] = useState<DonationCampaign>();
  const [fetchCampaigns, setFetchCampaigns] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messageBar, setMessageBar] = useState<IMessageBar | null>(null);
  const navigate = useNavigate();

  const statusItems = useMemo(() => {
    if (props.statuses) {
      return Object.keys(props.statuses.DonationCampaign).map(statusKey => ({
        key: props.statuses.DonationCampaign[statusKey],
        text: getStatus(props.statuses.DonationCampaign, props.statuses.DonationCampaign[statusKey])
          .tag
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
        <div className="flex flex-row justify-end lg:mr-5 my-5 space-x-3">
          <Button onClick={() => handleOpenDrawer()} colorScheme="green">
            <AddIcon className="mr-2" fontSize={11} />
            <span>Create Donation Campaign</span>
          </Button>

          <NavLink to="/donations/list"><Button colorScheme="linkedin" p={5} className="flex justify-center items-center">
            See all campaigns</Button></NavLink>
        </div>
      </Box>
      <Flex direction={{ base: 'column', xl: 'row' }}>
        <Flex direction={{ base: 'column' }} className="xl:w-8/12 w-full lg:mr-5">
          {/* <Box className="w-full h-full lg:flex flex-col">
            <DonationCampaignStatistics donationCampaign={selectedDonationCampaign} />
          </Box> */}
          <Box className="w-full h-full">

            <Box className="w-full flex lg:flex-row flex-col justify-between">
              {props.statuses &&
                donationCampaigns.length > 0 &&
                donationCampaigns.map(
                  (iDonationCampaign, index) =>
                    index <= 2 && (
                      <ScaleFade
                        initialScale={0.8}
                        in={!!donationCampaigns}
                        key={iDonationCampaign.id}
                        className="lg:my-5"
                      >
                        <DonationCampaignCard
                          statuses={props.statuses}
                          donationCampaign={iDonationCampaign}
                          onEdit={id => {
                            setSelectedCampaignId(id);
                            setIsDrawerOpen(true);
                          }}
                          onArchive={id => console.log('Show Archieve modal')}
                          onSelect={(donationCampaign) => navigate(`/donations/${donationCampaign.id}`)}
                        />
                      </ScaleFade>
                    )
                )}
            </Box>
          </Box>

        </Flex>
        {/* Transform this into drawer when on mobile */}
        <Flex direction={{ base: 'column' }} className="xl:w-4/12 w-full">
          <Box
            bg={useColorModeValue('white', 'gray.700')}
            border="1px"
            borderColor={useColorModeValue('gray.200', 'gray.400')}
            p={5}
            className="w-full h-full shadow rounded-lg"
          >
            <DonorsOverview />
          </Box>
          <Box className="w-full h-full mt-5 lg:p-1 flex flex-col">
            <DonationOverview />
          </Box>
        </Flex>
      </Flex>

      {props.statuses && (
        <DonationCampaignDrawer
          isOpen={isDrawerOpen}
          onClose={handleDrawerClose}
          donationCampaignId={selectedCampaignId}
          statuses={props.statuses}
        />
      )}
    </Box>
  );
};

export default withStatusFetching(Donations);
