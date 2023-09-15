import React, { useContext, useEffect } from 'react';
import moment from 'moment';
import { Table, Badge, Button, Box, TableContainer, useColorModeValue, Thead, Tr, Td, Th, Tbody } from '@chakra-ui/react';

import { RiRefund2Fill } from 'react-icons/ri';

import { Invoice } from '../../types/Reservation';
import { IColumnProps } from '../../interfaces';
import { getStatus, getStatusColor } from '../../utils/utilities';

import { MdPayment } from 'react-icons/md';

interface IPaymentTable {
  paymentIntents: Invoice[] | [];
  statuses?: any;
  onPayment?: (invoice: Invoice) => void;
}

const PaymentsTable: React.FC<IPaymentTable> = ({ statuses, paymentIntents }) => {
  const columns: IColumnProps[] = [
    { header: 'ID', accessor: 'id' },
    { header: 'Amount', accessor: 'totalWithFees', render: (value) => <span>${value}</span> },
    {
      header: 'Status',
      accessor: 'StatusId',
      render: (value) => <Badge colorScheme={getStatusColor(getStatus(statuses.Invoice, value).tag || '')}>{getStatus(statuses.Invoice, value).tag}</Badge>,
    },
    { header: 'Updated At', accessor: 'updatedAt', render: (value) => moment(value).tz('America/Toronto').format('DD MMM, YYYY [at] HH:mma') },
    { header: 'Created', accessor: 'createdAt', render: (value) => moment(value).tz('America/Toronto').format('DD MMM, YYYY [at] HH:mma') },
    { header: 'Created By', accessor: 'createdBy' },
  ];

  const renderCell = (item: any, column: IColumnProps) => {
    if (column.render) {
      return column.render(item[column.accessor], item);
    }
    return item[column.accessor];
  };
  const showPaymentButton = paymentIntents?.find((iPaymentIntent) => iPaymentIntent.StatusId === statuses.Invoice.PENDING);
  return (
    <Box>
      <TableContainer>
        <Table
          bg={useColorModeValue('white', 'gray.800')}
          color={useColorModeValue('gray.800', 'white')}
          borderRadius="15px"
          shadow="sm"
          overflowY={'scroll'}
          size={{ base: 'sm', md: 'md' }}
        >
          <Thead>
            <Tr>
              {columns.map((column) => (
                <Th key={column.accessor}>{column.header} </Th>
              ))}
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {paymentIntents?.map((item) => (
              <Tr key={item.id.toString()}>
                {columns.map((iColumn) => (
                  <Td key={iColumn.accessor}>
                    <div>{renderCell(item, iColumn)}</div>
                  </Td>
                ))}
                {showPaymentButton ? (
                  <Td>
                    <Button colorScheme="orange" size={{ base: 'sm', md: 'md' }} className="ml-2">
                      <MdPayment className="mr-2" /> <span>Pay</span>
                    </Button>
                  </Td>
                ) : (
                  <Td>
                    <Button size={{ base: 'sm', md: 'md' }} colorScheme="teal">
                      <RiRefund2Fill className="mr-2" /> Refund
                    </Button>
                  </Td>
                )}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PaymentsTable;
