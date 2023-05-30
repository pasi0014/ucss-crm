import { useContext, useEffect, useMemo, useState } from 'react';

import { useColorModeValue, Button, Flex, Heading, Box, Select } from '@chakra-ui/react';

import MessageBar from '../MessageBar';
import { AppContext } from '../../context/AppContext';
import { StatusContext } from '../../context/StatusContext';
import { getStatus } from '../../utils/utilities';
import { updateEventStatus } from './calls';
import { propNames } from '@chakra-ui/react';

export function PublishEvent(props: { onNext: () => void; entity: string; eventStatus: number }) {
  const { setAppLoading } = useContext<any>(AppContext);
  const { statuses } = useContext<any>(StatusContext);

  const [selectedStatus, setSelectedStatus] = useState<any>(props.eventStatus || statuses.Event.DRAFT);

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
          message: `Unexpected error while trying to update Event's Status`,
        });
      }
    } catch (error: any) {
      console.log(`Unexpected error while trying to update Event's Status`);
      setMessageBar({ type: 'error', message: error.message });
    }
    setAppLoading(false);
  };

  useEffect(() => {
    console.log({ selectedStatus });
  }, [selectedStatus]);

  useEffect(() => {
    if (props.eventStatus) {
      console.log({ test: getStatus(statuses.Event, statuses.Event[props.eventStatus]).tag });
    }
  }, [props.eventStatus]);

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
        {/* <Heading as="h3" size="sm">
        </Heading> */}
        <Select
          placeholder="Select a status"
          value={selectedStatus}
          onChange={(val: React.ChangeEvent<HTMLSelectElement>) => {
            console.log({ val: val.target.selectedOptions });
          }}
        >
          {statusItems.map((status: any) => (
            <option key={status.key}>{status.text}</option>
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
