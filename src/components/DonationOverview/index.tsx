import { useColorModeValue } from '@chakra-ui/react';
import { StatLabel } from '@chakra-ui/react';
import { Heading } from '@chakra-ui/react';
import { StatNumber } from '@chakra-ui/react';
import { Text } from '@chakra-ui/react';
import { Flex } from '@chakra-ui/react';
import { Stat } from '@chakra-ui/react';
import { Box } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FaMoneyBill } from 'react-icons/fa';
import { FiUsers } from 'react-icons/fi';
import { getDoantionOverview } from '../../data/donationService';
import { DonationOverviewType } from '../../data/types/DonationOverview';

const DonationOverview = () => {
  const [donationOverview, setDonationOverview] = useState<DonationOverviewType | null>(null);
  const [loading, setLoading] = useState(false);
  const bgColor = useColorModeValue('white', 'gray.700');

  const doGetDonationOverview = async () => {
    setLoading(true);
    try {
      const response = await getDoantionOverview();
      if (!response.success) {
        throw new Error(response.data.errors);
      }
      setDonationOverview(response.data);
    } catch (error: any) {
      console.error(`Error :: ${error.message}`);
    }
    setLoading(false);
  };

  useEffect(() => {
    doGetDonationOverview();
  }, []);

  return (
    <>
      <Box className="flex lg:flex-row flex-col lg:space-x-3 lg:space-y-0 space-y-4">
        <Box className="lg:w-6/12 w-full p-4 rounded-lg shadow-sm" bg={bgColor}>
          <Stat>
            <StatLabel mb={2}>
              <Flex justifyContent={'space-between'}>
                <Heading as="h3" size="sm">
                  Total Donations
                </Heading>
                <Box
                  display={{ base: 'flex' }}
                  color="#FFFFFF"
                  bg="#3182CE"
                  p={3}
                  borderRadius="15px"
                >
                  <FaMoneyBill size={16} />
                </Box>
              </Flex>
            </StatLabel>
            <StatNumber>
              <Text fontSize="1xl">${donationOverview?.totalDonations}</Text>
            </StatNumber>
          </Stat>
        </Box>
        <Box className="lg:w-6/12 w-full p-4 rounded-lg shadow-sm" bg={bgColor}>
          <Stat>
            <StatLabel mb={2}>
              <Flex justifyContent={'space-between'}>
                <Heading as="h3" size="sm">
                  Donations today
                </Heading>
                <Box
                  display={{ base: 'flex' }}
                  color="#FFFFFF"
                  bg="#3182CE"
                  p={3}
                  borderRadius="15px"
                >
                  <FaMoneyBill size={16} />
                </Box>
              </Flex>
            </StatLabel>
            <StatNumber>
              <Text fontSize="1xl">${donationOverview?.dailyDonations}</Text>
            </StatNumber>
          </Stat>
        </Box>
      </Box>

      <Box className="flex lg:flex-row flex-col lg:space-x-3 mt-5 lg:space-y-0 space-y-4">
        <Box className="lg:w-6/12 w-full p-4 rounded-lg shadow-sm" bg={bgColor}>
          <Stat>
            <StatLabel mb={2}>
              <Flex justifyContent={'space-between'}>
                <Heading as="h3" size="sm">
                  Total Donors
                </Heading>
                <Box
                  display={{ base: 'flex' }}
                  color="#FFFFFF"
                  bg="#3182CE"
                  p={3}
                  borderRadius="15px"
                >
                  <FiUsers size={16} />
                </Box>
              </Flex>
            </StatLabel>
            <StatNumber>
              <Text fontSize="1xl">{donationOverview?.totalDonors}</Text>
            </StatNumber>
          </Stat>
        </Box>
        <Box className="lg:w-6/12 w-full p-4 rounded-lg shadow-sm" bg={bgColor}>
          <Stat>
            <StatLabel mb={2}>
              <Flex justifyContent={'space-between'}>
                <Heading as="h3" size="sm">
                  Average Donations
                </Heading>
                <Box
                  display={{ base: 'flex' }}
                  color="#FFFFFF"
                  bg="#3182CE"
                  p={3}
                  borderRadius="15px"
                >
                  <FaMoneyBill size={16} />
                </Box>
              </Flex>
            </StatLabel>
            <StatNumber>
              <Text fontSize="1xl">${donationOverview?.averageDonation}</Text>
            </StatNumber>
          </Stat>
        </Box>
      </Box>
    </>
  );
};

export default DonationOverview;
