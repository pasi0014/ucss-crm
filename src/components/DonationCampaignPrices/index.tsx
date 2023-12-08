import React, { ChangeEvent, ReactElement, ReactHTMLElement, useCallback, useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';

import {
  InputLeftElement,
  InputGroup,
  Checkbox,
  Input,
  FormLabel,
  FormControl,
  Flex,
  Button,
  useToast,
  ScaleFade,
  useColorModeValue,
  Heading,
  Box
} from '@chakra-ui/react';

import MessageBar, { IMessageBar } from '../MessageBar';
import { createDonationPrice, getDonationCampaignPrices } from './calls';
import { DonationCampaignPrice } from '../../data/types/DonationCampaignPrice';
import { getStatus, getStatusColor } from '../../utils/utilities';
import { Badge } from '@chakra-ui/react';
import { IconButton } from '@chakra-ui/react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';

interface IDonationCampaignPriceProps {
  donationCampaignId?: number;
  productId: string;
  statuses: any;
}

interface PriceObj {
  nameEn: string;
  amount: number;
}

const DonationCampaignPrices: React.FC<IDonationCampaignPriceProps> = ({ donationCampaignId, productId, statuses }) => {
  const toast = useToast();
  const { setAppLoading } = useContext<any>(AppContext);
  const [prices, setPrices] = useState<any[]>([]);
  const [price, setPrice] = useState<any>({
    nameEn: '',
    amount: 5
  });
  const [messageBar, setMessageBar] = useState<IMessageBar | null>(null);

  const borderColor = useColorModeValue('border-gray-300', 'border-gray-500');

  const doFetchDonationCampaignPrices = async () => {
    setAppLoading(true);

    try {
      const response = await getDonationCampaignPrices(donationCampaignId);

      if (!response.success) {
        throw new Error(response.data);
      }
      setPrices(response.data);
    } catch (error: any) {
      console.error(`Error :: ${error.message}`);
      setMessageBar({ type: 'error', message: error.message });
    }

    setAppLoading(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrice((prevData: PriceObj) => ({
      ...prevData,
      nameEn: event.target.value
    }))
  };

  const doCreateDonationCampaignPrice = async () => {
    setAppLoading(true);
    setMessageBar(null);

    try {
      const response = await createDonationPrice(productId, price, donationCampaignId);

      if (!response.success) {
        console.log({ response })
        throw new Error(response.data);
      }
      doFetchDonationCampaignPrices();
    } catch (error: any) {
      console.error(`There was an error while creating Price :: ${error.message}`);
      setMessageBar({ type: 'error', message: error.message })
    }

    setAppLoading(false);
  };
  useEffect(() => {
    if (donationCampaignId) {
      doFetchDonationCampaignPrices();
    }
  }, []);

  return (
    <Box className="w-full h-full">
      <Box mt="15px">
        <Heading as="h3" size="lg" my={5}>
          Create a Donation Options
        </Heading>
      </Box>


      {messageBar && <MessageBar message={messageBar.message} type={messageBar.type} />}

      {/* Animation stuff */}
      <Flex direction={{ base: 'column', md: 'row' }} className="w-full h-full">
        <ScaleFade initialScale={0.9} in={true} className="md:w-6/12 w-full md:mr-3">
          <Box
            className={`${borderColor} border w-full rounded-lg flex flex-col items-center my-6`}
            p={{ base: '0px', md: '25px' }}
            bg={useColorModeValue('gray.50', 'gray.700')}
          >
            <Box className="w-full flex flex-col">
              <Box className="w-full p-3 flex flex-col">
                <span className="text-md font-bold w-full">Donation Name</span>
                <span className="mt-2 text-sm w-10/12">
                  This information will be used as the displayed name for Donation option.
                </span>
              </Box>
              <Box className="sm:w-10/12 w-full p-3">
                <Flex direction={{ base: 'column', md: 'row' }} justifyContent="space-between">
                  <FormControl mr="5%" isRequired>
                    <FormLabel>Donation Name</FormLabel>
                    <Input
                      type="text"
                      name="name"
                      value={price.nameEn}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                </Flex>
                <Flex
                  direction={{ base: 'column', md: 'row' }}
                  justifyContent="space-between"
                  mt={5}
                >
                  <FormControl mr="5%" isRequired>
                    <FormLabel>Donation Amount</FormLabel>
                    <InputGroup>
                      <InputLeftElement
                        pointerEvents="none"
                        color="gray.300"
                        fontSize="1.2em"
                        children="$"
                      />
                      <Input
                        placeholder="Enter amount"
                        type="text"
                        name="amount"
                        value={price.amount}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                          setPrice({ ...price, amount: event.target.value })
                        }
                      />
                    </InputGroup>
                  </FormControl>
                </Flex>
              </Box>
            </Box>
            <Flex my={10} className="w-full flex p-5" justifyContent="end">
              <Button
                colorScheme="red"
                mr="2%"
                className="sm:w-24 w-6/12"
                color={useColorModeValue('white', 'gray.100')}
              >
                Reset
              </Button>
              <Button
                colorScheme="blue"
                className="sm:w-24 w-6/12"
                _hover={{
                  bg: useColorModeValue('green.400', 'green.500')
                }}
                color={useColorModeValue('white', 'gray.100')}
                bg={useColorModeValue('green.500', 'green.600')}
                onClick={() => doCreateDonationCampaignPrice()}
              >
                Save
              </Button>
            </Flex>
          </Box>
        </ScaleFade>
        <ScaleFade initialScale={0.9} in={true} className="md:w-6/12 w-full md:ml-3">
          {!!prices.length && <Box
            className="w-full my-6 p-3 rounded-lg shadow"
            bg={useColorModeValue('gray.200', 'gray.700')}
          >
            <Heading size="md">Donation Options</Heading> {prices.map((iPrice: DonationCampaignPrice) => (
              <Box
                className={`p-3 ${borderColor} w-full border-2 rounded-lg mt-5 shadow-sm flex md:flex-row flex-col justify-between`}
              >
                <Box className="flex flex-col md:w-8/12 w-full p-3">
                  <Box>{iPrice.nameEn}</Box>
                  <Box className="flex flex-row w-full items-center"><span>$CAD {iPrice.amount}</span>
                    <Badge
                      fontSize="0.7em"
                      className="ml-5"
                      colorScheme={getStatusColor(
                        getStatus(statuses?.DonationCampaignPrice, iPrice.StatusId).tag || ''
                      )}
                    >
                      {getStatus(statuses?.DonationCampaignPrice, iPrice.StatusId).tag}
                    </Badge></Box>

                </Box>
                <Box className="w-3/12 flex flex-row mx-auto  justify-center">
                  <IconButton aria-label="Edit" icon={<EditIcon />} size="sm" mx="5px" my="3px" onClick={() => console.log({ iPrice })} />
                  <IconButton
                    aria-label="Delete"
                    icon={<DeleteIcon />}
                    size="sm"
                    mx="5px"
                    my="3px"
                    onClick={() => console.log({ iPrice })}
                  />
                </Box>
              </Box>
            ))}
          </Box>}
          {!prices.length && <Box className="w-full my-6 p-3 rounded-lg shadow"
            bg={useColorModeValue('gray.200', 'gray.700')}> There are no prices for this campaign yet.</Box>}

        </ScaleFade>
      </Flex>
    </Box >
  );
};

export default DonationCampaignPrices;
