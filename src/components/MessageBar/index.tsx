import React from "react";

import { Alert, AlertIcon, Stack } from "@chakra-ui/react";

interface IMessageBar {
  type: "error" | "success" | "warning" | "info";
  message: any;
}

const MessageBar = (props: IMessageBar) => {
  return (
    <Stack spacing={3}>
      <Alert status={props.type}>
        <AlertIcon />
        {props.message}
      </Alert>
    </Stack>
  );
};

export default MessageBar;
