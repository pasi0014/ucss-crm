import { Box, Center, IconButton, Text, Flex } from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { MouseEventHandler } from "react";

interface Props {
  onShowSidebar: MouseEventHandler;
  showSidebarButton?: boolean;
  title?: String;
}

const Header = ({
  showSidebarButton = true,
  onShowSidebar,
  title = "",
}: Props) => {
  return (
    <Flex bg="tomato" p={4} color="white" justifyContent="center">
      <Box flex="1">
        {showSidebarButton && (
          <IconButton
            aria-label="IconButton"
            icon={<ChevronRightIcon w={8} h={8} />}
            colorScheme="blackAlpha"
            variant="outline"
            onClick={onShowSidebar}
          />
        )}
      </Box>
      <Center flex="1" h="40px">
        <Text fontSize="xl">Page Title</Text>
      </Center>
      <Box flex="1" />
    </Flex>
  );
};

export default Header;
