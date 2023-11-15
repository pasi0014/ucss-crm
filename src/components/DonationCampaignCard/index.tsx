import { AddIcon, EditIcon, ExternalLinkIcon, HamburgerIcon, RepeatIcon } from '@chakra-ui/icons';
import { Flex } from '@chakra-ui/react';
import { useColorModeValue } from '@chakra-ui/react';
import { MenuList } from '@chakra-ui/react';
import { MenuButton } from '@chakra-ui/react';
import { Menu } from '@chakra-ui/react';
import { Badge } from '@chakra-ui/react';
import { IconButton } from '@chakra-ui/react';
import { MenuItem } from '@chakra-ui/react';
import { Heading } from '@chakra-ui/react';
import { Box } from '@chakra-ui/react';
import moment from 'moment';
import React from 'react';
import { BsArchive } from 'react-icons/bs';
import { FiMoreVertical } from 'react-icons/fi';
import { getStatus, getStatusColor } from '../../utils/utilities';
import PieChart from '../PieChart';
import { pieChartData, pieChartOptions } from '../PieChart/chartData';
import { DonationCampaign } from '../../data/types/DonationCampaign';
import { Button } from '@chakra-ui/react';

interface IDonationCampaignCardProps {
  donationCampaign: DonationCampaign;
  statuses: any;
  onEdit: (campaignId: number | undefined) => void;
  onArchive: (campaignId: number | undefined) => void;
  onSelect: (campaign: DonationCampaign) => void;
}
const DonationCampaignCard: React.FC<IDonationCampaignCardProps> = ({
  statuses,
  donationCampaign,
  onEdit,
  onArchive,
  onSelect
}) => {
  return (
    <Box
      bg={useColorModeValue('white', 'gray.600')}
      p={5}
      className="rounded-lg text-left w-full h-full shadow mb-5"
      _hover={{
        bgGradient: `linear(to-r, ${useColorModeValue('pink.200', 'pink.400')} ,${useColorModeValue(
          'purple.300',
          'purple.400'
        )})`,
        boxShadow: 'lg',
        shadow: 'md',
        color: 'white'
      }}
    >
      {/* <Flex direction={{ base: 'column', md: 'row' }}> */}
      {/* <Box className="w-4/12 mx-auto text-center flex flex-col items-center justify-between p-1">
          <Heading size="xs">Donations Collected</Heading>
          <PieChart h="100%" w="100%" chartData={pieChartData} chartOptions={pieChartOptions} />
        </Box> */}
      <Flex direction="column" className="w-full">
        <div className="flex flex-row justify-between">
          <Heading as="h3" size="md" mb={3}>
            {donationCampaign.nameEn}
          </Heading>

          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<FiMoreVertical />}
              variant="outline"
            />
            <MenuList>
              <MenuItem
                icon={<EditIcon />}
                onClick={() => onEdit(donationCampaign.id)}
                color={useColorModeValue('gray.700', 'gray.200')}
                _hover={{ color: useColorModeValue('gray.700', 'gray.200') }}
              >
                Edit Campaign
              </MenuItem>
              <MenuItem
                icon={<BsArchive />}
                onClick={() => onArchive(donationCampaign.id)}
                color={useColorModeValue('gray.700', 'gray.200')}
                _hover={{ color: useColorModeValue('gray.700', 'gray.200') }}
              >
                Archieve Campaign
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
        {/* 
          <Box mt={3}>
            <span className="text-md">{donationCampaign.contentEn}</span>
          </Box> */}
        <Box>
          <span className="text-sm font-bold">
            Campaign Start: {moment(donationCampaign.startDate).format('MMMM D, YYYY')}
          </span>
        </Box>
        <Box>
          <span className="text-sm font-bold">
            Campaign End: {moment(donationCampaign.endDate).format('MMMM D, YYYY')}
          </span>
        </Box>
        <Box>
          <span className="font-xs mr-2">Status</span>
          <Badge
            fontSize="0.3em"
            colorScheme={getStatusColor(
              getStatus(statuses.DonationCampaign, donationCampaign.StatusId).tag || ''
            )}
          >
            {getStatus(statuses.DonationCampaign, donationCampaign.StatusId).tag}
          </Badge>
        </Box>
      </Flex>
      <div className="w-full flex justify-center mt-5">
        <Button colorScheme="green" className="w-full" onClick={() => onSelect(donationCampaign)}>
          Open
        </Button>
      </div>
      {/* </Flex> */}
    </Box>
  );
};

export default DonationCampaignCard;
