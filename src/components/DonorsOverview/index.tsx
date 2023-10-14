import React, { useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';
import { fetchTopDonors } from '../../data/donorsService';
import MessageBar, { IMessageBar } from '../MessageBar';
import { IColumnProps } from '../../interfaces';
import { Center } from '@chakra-ui/react';
import { Spinner } from '@chakra-ui/react';

const columns: IColumnProps[] = [
  {
    header: 'Name',
    accessor: 'name',
    render: value => <span>{value}</span>
  },
  { header: 'Amount', accessor: 'amount' }
];

const DonorsOverview = () => {
  const [topDonors, setTopDonors] = useState([]);

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messageBar, setMessageBar] = useState<IMessageBar | null>(null);

  const doFetchTopDonors = async () => {
    setLoading(true);
    setMessageBar(null);

    try {
      const response = await fetchTopDonors();
      if (!response.success) {
        throw new Error(response.data);
      }
      setTopDonors(response.data);
    } catch (error: any) {
      console.error(`Error :: ${error.message}`);
      setMessageBar({ type: 'error', message: error.message });
    }

    setLoading(false);
  };

  useEffect(() => {
    doFetchTopDonors();
  }, []);

  return (
    <Box className="w-full h-full">
      {loading && (
        <Center>
          <Spinner size="sm" />
        </Center>
      )}
      <div className="text-lg font-bold">Top Donors</div>

      {messageBar && <MessageBar type={messageBar.type} message={messageBar.message} />}

      {!topDonors.length && (
        <MessageBar type="info" message={'There are no data available currently'} />
      )}

      {topDonors.map((iDonor: any) => (
        <>{iDonor.name}</>
      ))}
    </Box>
  );
};

export default DonorsOverview;
