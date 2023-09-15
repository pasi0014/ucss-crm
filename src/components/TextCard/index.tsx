import React, { useState } from 'react';
import { Box, Text, Collapse, Button, useColorModeValue } from '@chakra-ui/react';

interface CustomCardProps {
  title?: string;
  content: string;
  maxHeight?: string;
}

const TextCard: React.FC<CustomCardProps> = ({ title, content, maxHeight = '100%' }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="md"
      bg={useColorModeValue('white', 'gray.800')}
      position="relative"
      maxHeight={'100%'}
    >
      <Box p="4">
        {/* <Text fontSize="xl" fontWeight="semibold" mb="2">
          {title}
        </Text> */}
        <Collapse in={isCollapsed}>
          <Text noOfLines={3} opacity={isCollapsed ? 1 : 0.8} transition="opacity 0.3s" dangerouslySetInnerHTML={{ __html: content }} />
        </Collapse>
      </Box>
      <Box position="absolute" bottom="0" left="0" right="0" p="2" textAlign="center">
        <Button size="sm" onClick={toggleCollapse}>
          {isCollapsed ? 'Show More' : 'Show Less'}
        </Button>
      </Box>
    </Box>
  );
};

export default TextCard;
