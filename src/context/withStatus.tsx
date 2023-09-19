import React, { ComponentType, useContext, useEffect, useState } from 'react';
import { AppContext } from './AppContext';
import { getStatuses } from './calls';
import { useToast } from '@chakra-ui/react';

const withStatusFetching = <P extends object>(WrappedComponent: ComponentType<P>) => {
  return function WithStatusFetching(props: P) {
    const toast = useToast();
    const [statuses, setStatuses] = useState<any>(null);
    const { setAppLoading } = useContext<any>(AppContext);
    const [error, setError] = useState(false);

    const doGetStatuses = async () => {
      setAppLoading(true);

      try {
        const response = await getStatuses();
        if (!response.success) {
          setError(true);
          toast({
            title: 'API Error!',
            description: `${response.data}`,
            position: 'top-right',
            status: 'error',
            duration: 9000,
            isClosable: true,
          });
        }
        if (response.resStatus === 401) {
          setAppLoading(false);
        }

        const statusObj = {} as any;

        response.data.content.forEach((status: any) => {
          if (!statusObj[status.entity]) {
            statusObj[status.entity] = {};
          }
          statusObj[status.entity][status.value] = status.id;
        });

        setStatuses(statusObj);
      } catch (error: any) {
        console.error('Unexpected Error: ', { ...error });
      }

      setAppLoading(false);
    };

    useEffect(() => {
      if (!statuses) {
        doGetStatuses();
      }
    }, [statuses]);

    return <WrappedComponent {...props} statuses={statuses} />;
  };
};

export default withStatusFetching;
