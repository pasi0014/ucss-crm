import { Button } from '@chakra-ui/react';
import { useColorModeValue } from '@chakra-ui/react';
import { Text } from '@chakra-ui/react';
import { Icon } from '@chakra-ui/react';
import { Flex } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { IoCheckmarkCircle } from 'react-icons/io5';
import { MdBarChart, MdOutlineCalendarToday } from 'react-icons/md';
import { RiArrowUpSFill } from 'react-icons/ri';
import LineChart from '../LineChart';
import { Box } from '@chakra-ui/react';
import { lineChartDataTotalSpent, lineChartOptionsTotalSpent } from './chartData';
import { Heading } from '@chakra-ui/react';
import DataTable from '../DataTable';
import moment from 'moment';
import { IColumnProps } from '../../interfaces';
import { Donor } from '../../types/Donor';
import MessageBar, { IMessageBar } from '../MessageBar';
import { getCampaignDonors } from './calls';
import { DonationCampaign } from '../../types/DonationCampaign';

// Purpose:
// 1. Needs to show a donation statistics
// 2. Possible page engagement
// 3. Calculate conversion rate?
// 4. Show top 10 donors
// 5. Be able to open a donor page

interface IDonationCampaignStatistics {
  donationCampaign?: DonationCampaign;
}

const DonationCampaignStatistics: React.FC<IDonationCampaignStatistics> = ({ donationCampaign }) => {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(false);
  const [messageBar, setMessageBar] = useState<IMessageBar | null>(null);

  const doFetchDonors = async (isMounted: boolean) => {
    setLoading(true);
    setMessageBar(null);

    try {
      const response = await getCampaignDonors(donationCampaign?.id);

      if (!response.success) {
        throw new Error(response.data);
      }

      if (isMounted) {
        setDonors(response.data);
      }
    } catch (error: any) {
      console.error(`Error :: ${error.message}`);
      setMessageBar({ type: 'error', message: error.message });
    }
  };

  useEffect(() => {
    let isMounted = true;

    if (donationCampaign) {
      doFetchDonors(isMounted);
    }

    return () => {
      isMounted = false;
    };
  }, [donationCampaign]);

  const columns: IColumnProps[] = [
    { header: 'Name', accessor: 'name', render: (value) => <span>{value}</span> },
    { header: 'Contact', accessor: 'best_contact' },
    { header: 'Organization', accessor: 'organization' },
    { header: 'Last Donation', accessor: 'lastDonation', render: (value) => moment(value).tz('America/Toronto').format('DD MMM, YYYY [at] HH:mma') },
    { header: 'Created At', accessor: 'createdAt', render: (value) => moment(value).tz('America/Toronto').format('DD MMM, YYYY [at] HH:mma') },
  ];

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  return (
    <div className="w-full">
      {messageBar && (
        <Box py={3}>
          <MessageBar type={messageBar.type} message={messageBar.message} />
        </Box>
      )}
      <Box className="w-full rounded-xl shadow" bg={useColorModeValue('white', 'gray.700')} h="35vh" p={{ base: 3, sm: 5 }} my={{ base: 5, md: 0 }}>
        <Flex align="center" justify="space-between" w="100%" pe="20px" pt="5px">
          {donationCampaign && <Heading size="md">{donationCampaign.nameEn}</Heading>}

          <Button fontSize="sm" fontWeight="500" borderRadius="7px">
            <Icon as={MdOutlineCalendarToday} me="4px" />
            See full report
          </Button>
        </Flex>
        <Flex w="100%" flexDirection={{ base: 'column', lg: 'row' }}>
          <Flex flexDirection="column" me="20px" mt="28px">
            <Text color={textColor} fontSize="34px" textAlign="start" fontWeight="700" lineHeight="100%">
              $CAD 37.5K
            </Text>
            <Flex align="center" mb="20px">
              <Text color="secondaryGray.600" fontSize="sm" fontWeight="500" mt="4px" me="12px">
                Total Spent
              </Text>
            </Flex>

            {/* <Flex align="center">
              <Icon as={IoCheckmarkCircle} color="green.500" me="4px" />
              <Text color="green.500" fontSize="md" fontWeight="700">
                On track
              </Text>
            </Flex> */}
          </Flex>
          <Box minH="260px" className="w-full" mt="auto">
            <LineChart chartData={lineChartDataTotalSpent} chartOptions={lineChartOptionsTotalSpent} />
          </Box>
        </Flex>
      </Box>

      <Box h="40vh" className="w-full overflow-scroll rounded-xl shadow" bg={useColorModeValue('white', 'gray.700')} p={{ base: 3, sm: 5 }} mt={15}>
        <Heading size="md">Top Donors</Heading>
        <DataTable columns={columns} items={[]} dataDescription="Donors" />
      </Box>
    </div>
  );
};

export default DonationCampaignStatistics;
