import React, { useState, ChangeEvent, useEffect } from 'react';
import { InputLeftElement, InputGroup, Input, Box, Spinner, useColorModeValue, Flex } from '@chakra-ui/react';
import { Search2Icon } from '@chakra-ui/icons';

// import { Client } from '../../types/Client';

import { searchClients } from './calls';
import { Client } from '../../types/Reservation';

interface ISearchBarProps {
  entity: string;
  onSelect: (value: Client) => void;
}

const SearchBar: React.FC<ISearchBarProps> = ({ entity, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const bgColor = useColorModeValue('', 'bg-gray-800');
  const resultBg = useColorModeValue('gray.200', 'gray.500');

  const handleSearch = async () => {
    if (searchTerm && searchTerm.length > 3) {
      setIsLoading(true);
      try {
        const response = await searchClients(searchTerm);
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
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Search2Icon color="gray.300" />
          </InputLeftElement>
          <Input
            type="text"
            bg={useColorModeValue('white', 'gray.700')}
            placeholder={`Search ${entity || '...'}`}
            value={searchTerm}
            onChange={handleChange}
            sx={{ color: isLoading ? useColorModeValue('gray.300', 'gray.500') : useColorModeValue('gray.500', 'white') }}
          />
        </InputGroup>
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
                    bgColor || 'bg-gray-800'
                  } duration-300 rounded-xl`}
                  onClick={() => {
                    setSearchTerm('');
                    onSelect(iClient);
                  }}
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
