import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Client } from '../../data/types/Reservation';
import { IMessageBar } from '../../components/MessageBar';
import { Box } from '@chakra-ui/react';
import { Heading } from '@chakra-ui/react';
import { getClientInfo } from './calls';

const ClientPage = () => {
  const { clientId } = useParams();
  const [loading, setLoading] = useState(false);
  const [clientInfo, setClientInfo] = useState<Client | null>(null);
  const [messageBar, setMessageBar] = useState<IMessageBar | null>(null);

  const doGetClientInfo = async (id: string) => {
    setLoading(true);
    setMessageBar(null);

    try {
      const response = await getClientInfo(id);
      if (!response.success) {
        throw new Error(response.data);
      }
      setClientInfo(response.data);
    } catch (error: any) {
      console.log(`Error :: ${error.message}`);
      setMessageBar({ type: 'error', message: error.message });
    }
    setLoading(false);
  };

  useEffect(() => {
    let mounted = true;

    if (mounted && clientId) {
      doGetClientInfo(clientId);
    }
    return () => {
      mounted = false;
    };
  }, [clientId]);

  return (
    <Box textAlign="left" my={5} p={3}>
      <Heading>Client Info</Heading>
      <div className="flex  bg-red-100 my-5">
        <div>123 123</div>
        <div>Client Info column</div>
      </div>
    </Box>
  );
};

export default ClientPage;
