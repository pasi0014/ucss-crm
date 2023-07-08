import React from 'react';

import { Alert, AlertIcon, Stack } from '@chakra-ui/react';

export interface IMessageBar {
  type: 'error' | 'success' | 'warning' | 'info';
  message: any;
}

const MessageBar: React.FC<IMessageBar> = ({ type, message }) => {
  return (
    <Stack spacing={3}>
      <Alert status={type}>
        <AlertIcon />
        {message}
      </Alert>
    </Stack>
  );
};

export default MessageBar;
