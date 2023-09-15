import React, { useEffect, useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, TableCaption, IconButton, Tooltip, Box, useColorModeValue } from '@chakra-ui/react';
import { EditIcon, SearchIcon, ViewIcon, DeleteIcon } from '@chakra-ui/icons';
import { InputGroup } from '@chakra-ui/react';
import { Input } from '@chakra-ui/react';
import { InputRightElement } from '@chakra-ui/react';
import MessageBar from '../MessageBar';
import { TableContainer } from '@chakra-ui/react';
import { IColumnProps } from '../../interfaces';
import { Button } from '@chakra-ui/react';
import { Text } from '@chakra-ui/react';

type Column = {
  header: string;
  accessor: string;
};

type Item = {
  [key: string]: string | number;
};

type Props = {
  columns: Column[];
  items: Item[];
  showSearch?: boolean;
  dataDescription?: String;
  onOpenRecord?: (item: Item) => void;
  onEditRecord?: (item: Item) => void;
  onDeleteRecord?: (item: Item) => void;
  disableEdit?: boolean;
  disableDelete?: boolean;
  disableOpen?: boolean;
};

const DataTable: React.FC<Props> = ({
  columns,
  items,
  dataDescription,
  showSearch = false,
  onOpenRecord,
  onEditRecord,
  onDeleteRecord,
  disableOpen = false,
  disableDelete = true,
  disableEdit = true,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const itemsPerPage = 15; // Change this value as needed

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset the current page when searching
  };

  const filteredItems = items.filter((item) => Object.values(item).join(' ').toLowerCase().includes(searchTerm.toLowerCase()));

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  // Get the current page's items
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, endIndex);

  const sortedItems = [...currentItems].sort((a, b) => {
    if (sortColumn) {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const handleColumnSort = (accessor: string) => {
    if (sortColumn === accessor) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(accessor);
      setSortOrder('asc');
    }
  };

  const renderCell = (item: any, column: IColumnProps) => {
    if (column.render) {
      return column.render(item[column.accessor], item);
    }
    return item[column.accessor];
  };

  return (
    <Box>
      {showSearch && (
        <Box w="350px" my="15px" bg={useColorModeValue('gray.50', 'gray.700')}>
          <InputGroup>
            <Input bg={useColorModeValue('white', 'gray.700')} shadow="md" placeholder="Search" value={searchTerm} onChange={handleSearch} />
            <InputRightElement>
              <IconButton color={useColorModeValue('gray.600', 'gray.50')} aria-label="Search" icon={<SearchIcon />} onClick={handleSearch} />
            </InputRightElement>
          </InputGroup>
        </Box>
      )}

      <Box display="flex" justifyContent="end" my="20px">
        <Button size="sm" onClick={() => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))} disabled={currentPage === 1} mr="10px">
          Previous
        </Button>
        <Text fontSize="sm" fontWeight="semibold" display="flex" alignItems="center">
          Page {currentPage} of {totalPages}
        </Text>
        <Button size="sm" onClick={() => setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))} disabled={currentPage === totalPages} ml="10px">
          Next
        </Button>
      </Box>

      <Box style={{ overflowY: 'scroll' }}>
        <TableContainer>
          <Table
            bg={useColorModeValue('white', 'gray.800')}
            color={useColorModeValue('gray.800', 'white')}
            borderRadius="15px"
            shadow="sm"
            overflowY={'scroll'}
            size={{ base: 'sm', md: 'md' }}
          >
            <TableCaption>{!!filteredItems.length && dataDescription}</TableCaption>
            <Thead>
              <Tr>
                {columns.map((column) => (
                  <Th key={crypto.randomUUID()}>
                    <button onClick={() => handleColumnSort(column.accessor)} className="py-3">
                      {column.header} {sortColumn === column.accessor && <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                    </button>
                  </Th>
                ))}
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {sortedItems.map((item) => (
                <Tr key={item.id.toString()}>
                  {columns.map((column) => (
                    <Td key={crypto.randomUUID()}>
                      <div>{renderCell(item, column)}</div>
                    </Td>
                  ))}
                  <Td>
                    {!disableOpen && (
                      <Tooltip label="View" placement="top">
                        <IconButton aria-label="View" icon={<ViewIcon />} size="sm" mx="5px" my="3px" onClick={() => onOpenRecord && onOpenRecord(item)} />
                      </Tooltip>
                    )}
                    {!disableEdit && (
                      <Tooltip label="Edit" placement="top">
                        <IconButton aria-label="Edit" icon={<EditIcon />} size="sm" mx="5px" my="3px" onClick={() => onEditRecord && onEditRecord(item)} />
                      </Tooltip>
                    )}
                    {!disableDelete && (
                      <Tooltip label="Delete" placement="top">
                        <IconButton
                          aria-label="Delete"
                          icon={<DeleteIcon />}
                          size="sm"
                          mx="5px"
                          my="3px"
                          onClick={() => onDeleteRecord && onDeleteRecord(item)}
                        />
                      </Tooltip>
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
      {!filteredItems.length && (
        <Box display="flex" alignItems="center" justifyContent="center">
          <MessageBar type="info" message={`No Results found in ${dataDescription}`} />
        </Box>
      )}
    </Box>
  );
};

export default DataTable;
