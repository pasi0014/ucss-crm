import { useContext, useEffect, useMemo, useState } from 'react';

import { useColorModeValue, Button, Flex, Heading, Box, Select } from '@chakra-ui/react';

import MessageBar from '../MessageBar';
import { AppContext } from '../../context/AppContext';
import { StatusContext } from '../../context/StatusContext';
import { CheckIcon } from '@chakra-ui/icons';
import { getStatus } from '../../utils/utilities';
import { updateEventStatus } from './calls';

export function PublishEvent(props: { onNext: () => void; entity: string; eventId: any }) {
  const { setAppLoading } = useContext<any>(AppContext);
  const { statuses } = useContext<any>(StatusContext);

  const [selectedStatus, setSelectedStatus] = useState<any>(null);

  const statusItems = useMemo(
    () =>
      Object.keys(statuses.Event).map((statusKey) => ({
        key: statuses.Event[statusKey],
        text: getStatus(statuses.Event, statuses.Event[statusKey]).tag,
      })),
    [],
  );

  const [error, setError] = useState(false);
  const [messageBar, setMessageBar] = useState<any>({});

  const doUpdateStatus = async () => {
    setAppLoading(true);
    setError(false);

    try {
      const response = await updateEventStatus(selectedStatus);

      if (!response.success) {
        setError(true);
        setMessageBar({
          type: 'error',
          message: 'Unexpected error while trying to create Price',
        });
      }
    } catch (error) {
      console.log('Unexpected error while trying to create Price');
      setMessageBar({ type: 'ERROR' });
    }
    setAppLoading(false);
  };

  //   useEffect(() => {
  //     setEventStatuses(getEntityStatuses(''))
  //   }, [])

  return (
    <>
      <Box>
        <Heading as="h3" size="lg" my={5}>
          Publish the event
        </Heading>
      </Box>
      {error && (
        <Box mb={5}>
          <MessageBar type={messageBar.type} message={messageBar.message} />
        </Box>
      )}
      <Box>
        <Select placeholder="Select a status">
          {statuses.map((status: any) => (
            <option key={status.id} value={status.id}>
              {status.value}
            </option>
          ))}
        </Select>
      </Box>
      <Flex>
        <Button
          mt={7}
          _hover={{
            bg: useColorModeValue('green.400', 'green.500'),
          }}
          color={useColorModeValue('white', 'gray.100')}
          bg={useColorModeValue('green.500', 'green.600')}
          onClick={doUpdateStatus}
        >
          Create Price
        </Button>
      </Flex>
    </>
  );
}
