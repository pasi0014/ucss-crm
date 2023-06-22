import { useContext, useEffect, useMemo, useState } from 'react';

import { useColorModeValue, Button, Flex, Heading, Box, Select, useToast } from '@chakra-ui/react';

import MessageBar from '../MessageBar';
import { AppContext } from '../../context/AppContext';
import { StatusContext } from '../../context/StatusContext';
import { getStatus } from '../../utils/utilities';
import { findEventById } from '../EventForm/calls';
import { updateEventStatus } from './calls';

export function PublishEvent(props: { onNext: () => void; entity: string; eventId: number | undefined | null }) {
  const toast = useToast();
  const { setAppLoading } = useContext<any>(AppContext);
  const { statuses } = useContext<any>(StatusContext);

  const [selectedStatus, setSelectedStatus] = useState<any>(statuses.Event.DRAFT);

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

  const doGetEventStatus = async () => {
    setAppLoading(true);
    setError(false);

    try {
      const response = await findEventById(props.eventId);

      if (!response.success) {
        setError(true);
        throw new Error(`Error : ${response.data}`);
      }
      setSelectedStatus(response.data.StatusId);
    } catch (error: any) {
      console.error(`Unexpected error while contacting UcssAPI to get Event Status`, { ...error });
      setMessageBar({ type: 'error', message: error.message });
    }

    setAppLoading(false);
  };

  const doUpdateStatus = async () => {
    setAppLoading(true);
    setError(false);

    try {
      const response = await updateEventStatus(selectedStatus, props.eventId);

      if (!response.success) {
        setError(true);
        setMessageBar({
          type: 'error',
          message: `Unexpected error while trying to update Event's Status`,
        });
      }

      toast({
        title: 'Event Status updated!',
        description: `The Event status has been set to ${getStatus(statuses.Event, response.data.StatusId).tag}.`,
        position: 'top-right',
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
    } catch (error: any) {
      console.log(`Unexpected error while trying to update Event's Status`);
      setMessageBar({ type: 'error', message: error.message });
    }
    setAppLoading(false);
  };

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      doGetEventStatus();
    }

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <Box>
        <Heading as="h3" size="md" mt={10} mb={5}>
          Publish the event
        </Heading>
      </Box>
      {error && (
        <Box mb={5}>
          <MessageBar type={messageBar.type} message={messageBar.message} />
        </Box>
      )}
      <Box>
        <Select
          placeholder="Select a status"
          value={selectedStatus}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            setSelectedStatus(e.target.value);
          }}
        >
          {statusItems.map((status: any) => (
            <option key={status.key} value={status.key}>
              {status.text}
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
          Update Status
        </Button>
      </Flex>
    </>
  );
}
