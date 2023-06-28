import React, { useState, ChangeEvent, useEffect } from 'react';
import { Input, Box, Spinner, useColorModeValue, Flex } from '@chakra-ui/react';
import { searchClients } from './calls';
import { Client } from '../../types';
import { HStack } from '@chakra-ui/react';
import { VStack } from '@chakra-ui/react';
import { Button } from '@chakra-ui/react';

interface ISearchBarProps {
  entity: string;
}

const SearchBar: React.FC<ISearchBarProps> = ({ entity }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const bgColor = useColorModeValue('', 'bg-gray-500');
  const resultBg = useColorModeValue('gray.200', 'gray.600');

  const handleSearch = async () => {
    if (searchTerm && searchTerm.length > 3) {
      setIsLoading(true);
      try {
        const response = await searchClients(searchTerm);
        console.log({ response });
        setSearchResults(response.data || []);
      } catch (error) {
        console.error('Error while fetching search results:', error);
      }
      setIsLoading(false);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    if (timer) {
      clearTimeout(timer);
    }
    setTimer(
      setTimeout(() => {
        handleSearch();
      }, 500),
    );

    if (searchTerm.length === 0) {
      setSearchResults([]);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [searchTerm]);

  return (
    <React.Fragment>
      <Box mt={5}>
        <Input
          type="text"
          placeholder={`Search ${entity || '...'}`}
          className="text-red-500"
          value={searchTerm}
          onChange={handleChange}
          paddingRight="10rem"
          sx={{ color: isLoading ? useColorModeValue('gray.300', 'gray.500') : useColorModeValue('gray.500', 'white') }}
        />
      </Box>
      <Box>
        {isLoading && (
          <Flex p={5}>
            <Spinner size="sm" mr={2} />
            Loading...
          </Flex>
        )}
        {searchResults.length > 0
          ? searchResults.map((iClient: Client) => (
              <Box bg={resultBg} borderRadius="15px" my={2} boxShadow="sm" key={iClient.id}>
                <button
                  className={`flex flex-col text-left justify-items-start p-3 w-full transition-all ease hover:${
                    bgColor || 'bg-gray-100'
                  } duration-300 rounded-xl`}
                  onClick={() => console.log({ iClient })}
                >
                  <span>{`${iClient.firstName} ${iClient.lastName}`}</span>
                  <span className="text-xs">{`${iClient.phone}`}</span>
                  <span className="text-xs">{`${iClient.email}`}</span>
                </button>
              </Box>
            ))
          : searchTerm && <Flex className="p-2">No results found...</Flex>}
      </Box>
    </React.Fragment>
  );
};

export default SearchBar;
