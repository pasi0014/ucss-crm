import React from 'react';

import {
  HStack,
  //   IconButton,
  Menu,
  MenuButton,
  Flex,
  Avatar,
  VStack,
  Text,
  Box,
  MenuList,
  MenuItem,
  useColorModeValue,
  MenuDivider,
  useColorMode,
  Button,
  Icon,
} from '@chakra-ui/react';
import { FiChevronDown } from 'react-icons/fi';
import { FaSun, FaRegMoon } from 'react-icons/fa';
import { useSignOut } from 'react-auth-kit';
import { NavLink, useNavigate } from 'react-router-dom';

const ProfileCard = ({ user }: { user: any }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const signOut = useSignOut();
  const navigate = useNavigate();

  const doSignOut = () => {
    signOut();
    navigate('/login');
  };
  return (
    <HStack spacing={{ base: '0', md: '6' }}>
      {/* Bell icon here */}
      {/* <IconButton
        size="lg"
        variant="ghost"
        aria-label="open menu"
        icon={<FiBell />}
      /> */}

      <Flex alignItems={'center'}>
        <Box mr={7}>
          <Button onClick={toggleColorMode}>
            {colorMode === 'light' ? (
              <Icon as={FaRegMoon} />
            ) : (
              <Icon as={FaSun} />
            )}
          </Button>
        </Box>

        <Menu>
          <MenuButton
            py={2}
            transition="all 0.3s"
            _focus={{ boxShadow: 'none' }}
          >
            <HStack>
              <Avatar
                size={'sm'}
                src={
                  'https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
                }
              />
              <VStack
                display={{ base: 'none', md: 'flex' }}
                alignItems="flex-start"
                spacing="1px"
                ml="2"
              >
                <Text fontSize="sm">{`${user.firstName} ${user.lastName}`}</Text>
                <Text fontSize="xs" color="gray.600">
                  {user.role?.toLowerCase()}
                </Text>
              </VStack>
              <Box display={{ base: 'none', md: 'flex' }}>
                <FiChevronDown />
              </Box>
            </HStack>
          </MenuButton>
          <MenuList
            bg={useColorModeValue('white', 'gray.900')}
            borderColor={useColorModeValue('gray.200', 'gray.700')}
          >
            <NavLink to="/profile">
              <MenuItem>Settings</MenuItem>
            </NavLink>
            <MenuDivider />
            <MenuItem onClick={() => doSignOut()}>Sign out</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </HStack>
  );
};

export default ProfileCard;
