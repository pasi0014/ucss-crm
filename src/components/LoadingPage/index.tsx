import { Box } from '@chakra-ui/react';
import { Center } from '@chakra-ui/react';
import { Spinner } from '@chakra-ui/react';

const LoadingPage = () => {
  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      width="100%"
      height="100%"
      backgroundColor="rgba(0, 0, 0, 0.2)"
      zIndex="9999"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Center>
        <Spinner size="md" />
      </Center>
    </Box>
  );
};
export default LoadingPage;
