// import { Button, Input, InputGroup, InputLeftElement, InputRightAddon } from '@chakra-ui/react';
// import { SearchIcon } from '@chakra-ui/icons';
// import { useState } from 'react';

// interface ISearchBarProps {
//   entity: string;
//   onSearch: (searchTerm: string) => void;
// }

// const SearchBar = (props: ISearchBarProps) => {
//   const [searchTerm, setSearchTerm] = useState('');
//   return (
//     <>
//       <InputGroup borderRadius="15px" size="sm">
//         <Input
//           type="text"
//           placeholder={`Search ${props.entity ? props.entity : '...'}`}
//           borderRadius="15px"
//           p={5}
//           value={searchTerm}
//           onChange={(event: any) => setSearchTerm(event.target.value)}
//         />
//         <Button size="md" ml={3} p={5} onClick={() => props.onSearch(searchTerm)}>
//           Search
//         </Button>
//       </InputGroup>
//     </>
//   );
// };
// export default SearchBar;

import React, { useState, ChangeEvent, useEffect } from 'react';
import { Input, Box, Spinner } from '@chakra-ui/react';
import { CUIAutoComplete } from 'chakra-ui-autocomplete';
import { searchClients } from './calls';
import { Client } from '../../types';
import { useColorModeValue } from '@chakra-ui/react';
import { Flex } from '@chakra-ui/react';

interface ISearchBarProps {
  entity: string;
}

const SearchBar: React.FC<ISearchBarProps> = ({ entity }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

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
          placeholder={`Search ${entity || ''}`}
          className="text-red-500"
          value={searchTerm}
          onChange={handleChange}
          paddingRight="10rem"
          sx={{ color: isLoading ? useColorModeValue('gray.300', 'gray.500') : useColorModeValue('gray.500', 'white') }}
        />
      </Box>
      <Box>
        {isLoading ? (
          <Flex>
            <Spinner size="sm" mr={2} />
            Loading...
          </Flex>
        ) : searchResults.length > 0 ? (
          searchResults.map((iClient: Client) => (
            <Box bg={useColorModeValue('gray.300', 'gray.500')} p={3} borderRadius="10px" key={iClient.id}>{`${iClient.firstName} ${iClient.lastName}`}</Box>
          ))
        ) : (
          searchTerm && <Box>No results found...</Box>
        )}
      </Box>
    </React.Fragment>
  );
};

export default SearchBar;
