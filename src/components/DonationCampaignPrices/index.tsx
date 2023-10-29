import React, { useContext, useEffect, useState } from 'react';
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

import { IMessageBar } from '../MessageBar';
import { getDonationCampaignPrices } from './calls';

interface IDonationCampaignPriceProps {
  donationCampaignId: number | undefined;
}

const DonationCampaignPrices: React.FC<IDonationCampaignPriceProps> = ({ donationCampaignId }) => {
  // const toast = useToast();
  const { setAppLoading } = useContext<any>(AppContext);
  const [prices, setPrices] = useState<any[]>([]);
  const [price, setPrice] = useState<any>({
    nameEn: '',
    amount: 5
  });
  const [customAmount, setCustomAmount] = useState(false);
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

  const doCreateDonationCampaignPrice = async () => {
    setAppLoading(true);

    try {
      // const response =
    } catch (error) {}
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

      {/* Animation stuff */}
      <Flex direction={{ base: 'column', md: 'row' }} className="w-full h-full">
        <ScaleFade initialScale={0.9} in={true} className="md:w-6/12 w-full md:mr-3">
          <Box
            className={`${borderColor} border w-full rounded-lg flex flex-col items-center my-6`}
            p={{ base: '0px', md: '25px' }}
            bg={useColorModeValue('gray.50', 'gray.700')}
          >
            <Box className="w-full flex md:flex-row flex-col">
              <Box className="md:w-4/12 w-full p-3 flex flex-col">
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
                      onChange={() => console.log('')}
                    />
                  </FormControl>
                </Flex>
                <Flex
                  direction={{ base: 'column', md: 'row' }}
                  justifyContent="space-between"
                  mt={5}
                >
                  <FormControl mr="5%" isRequired>
                    <Checkbox value={customAmount} onChange={() => setCustomAmount(!customAmount)}>
                      Let donors select the amount
                    </Checkbox>
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
                        disabled={customAmount}
                      />
                      {/* <InputRightElement>
                        <CheckIcon color="green.500" />
                      </InputRightElement> */}
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
              >
                Save
              </Button>
            </Flex>
          </Box>
        </ScaleFade>
        <ScaleFade initialScale={0.9} in={true} className="md:w-6/12 w-full md:ml-3">
          <Box
            className="w-full my-6 p-3 rounded-lg shadow"
            bg={useColorModeValue('gray.200', 'gray.700')}
          >
            <Heading size="md">Donation Options</Heading>
            <Box
              className={`p-3 ${borderColor} w-full border-2 rounded-lg mt-5 shadow-sm flex md:flex-row flex-col justify-between`}
            >
              <Box className="flex flex-col md:w-8/12 w-full bg-red-100 p-3">
                <Box>border</Box>
                <Box>border</Box>
              </Box>
              <Box className="w-3/12 bg-blue-100 flex flex-col mx-auto">
                <Button>Edit</Button>
                <Button>Delete</Button>
              </Box>
            </Box>
          </Box>
        </ScaleFade>
      </Flex>
    </Box>
  );
};

export default DonationCampaignPrices;
