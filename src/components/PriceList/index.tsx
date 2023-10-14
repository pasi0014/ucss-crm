import React from 'react';
import { Price } from '../../data/types/Price';
import { Box } from '@chakra-ui/react';
import { useColorModeValue } from '@chakra-ui/react';
import { FaTicket } from 'react-icons/fa6';
import { Button } from '@chakra-ui/react';

interface PriceListProps {
  prices: Price[];
  onEdit?: (price: Price) => void;
  onDelete?: (price: Price) => void;
  statuses?: object;
}

const PriceList: React.FC<PriceListProps> = ({
  prices,
  onEdit,
  onDelete,
  statuses,
}) => {
  return (
    <div className="w-full">
      {prices.map((iPrice: Price) => (
        <Box
          key={iPrice.id}
          className="w-full rounded-xl shadow-sm flex flex-row items-center justify-between"
          p={{ base: 2, md: 5 }}
          my={3}
          border="1px"
          color={useColorModeValue('gray.700', 'gray.100')}
          _hover={{
            bgGradient: `linear(to-r, ${useColorModeValue(
              'teal.200',
              'teal.500',
            )},${useColorModeValue('teal.300', 'teal.400')})`,
            boxShadow: 'xl',
          }}
        >
          <div className="sm:w-6/12 w-8/12 flex flex-row items-center">
            <FaTicket size="25px" className="mr-5" />
            <div className="flex flex-col text-left">
              <div className="font-bold">{iPrice.name}</div>{' '}
              {iPrice.ticketType === 'free' ? 'Free' : `$${iPrice.amount}`}
            </div>
          </div>

          <div className="flex flex-row items-center">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="ml-3">On Sale</span>
          </div>
          <div className="w-2/12 flex flex-col space-y-3">
            {onEdit && iPrice && (
              <Button
                size="sm"
                colorScheme="orange"
                className="z-40"
                onClick={() => onEdit(iPrice)}
              >
                Edit
              </Button>
            )}
            {onDelete && iPrice.id && (
              <Button
                size="sm"
                colorScheme="red"
                className="z-40"
                onClick={() => onDelete(iPrice)}
              >
                Delete
              </Button>
            )}
          </div>
        </Box>
      ))}
    </div>
  );
};

export default PriceList;
