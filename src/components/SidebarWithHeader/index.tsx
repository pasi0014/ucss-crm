import React, { ReactNode, useEffect } from 'react';
import { IconButton, Box, CloseButton, Flex, Icon, useColorModeValue, Drawer, DrawerContent, Text, useDisclosure } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';

import { FiHome, FiMenu, FiCalendar, FiUsers } from 'react-icons/fi';
import { FaDonate, FaUsers, FaIdCard, FaChartBar } from 'react-icons/fa';
import { IconType } from 'react-icons';

import ProfileCard from '../ProfileCard';
import { ILoggedInUser } from '../../interfaces';

interface LinkItemProps {
  name: string;
  icon: IconType;
  url?: String;
}
const LinkItems: Array<LinkItemProps> = [
  { name: 'Home', icon: FiHome, url: '/dashboard' },
  { name: 'Statistics', icon: FaChartBar, url: '/login' },
  { name: 'Donors', icon: FaUsers, url: '/donors' },
  { name: 'Donations', icon: FaDonate, url: '/donations' },
  { name: 'Events', icon: FiCalendar, url: '/events' },
  { name: 'Reservations', icon: FaIdCard, url: '/reservations' },
  { name: 'Clients', icon: FiUsers, url: '/clients' },
];

const user: ILoggedInUser = {
  id: '1',
  lastName: 'Pasika',
  firstName: 'Nazar',
  role: 'ADMIN',
  email: 'nazar.pasika1@gmail.com',
};

export default function SidebarWithHeader({ children }: { children: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <SidebarContent onClose={() => onClose} display={{ base: 'none', md: 'block' }} />
      <Drawer autoFocus={false} isOpen={isOpen} placement="left" onClose={onClose} returnFocusOnClose={false} onOverlayClick={onClose} size="full">
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
}

interface SidebarProps {
  onClose: () => void;
  display?: any;
}

// SideBar Navigation
const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const { pathname } = useLocation();
  return (
    <Box
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="24" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          CRM
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon} url={link.url} currentPath={pathname}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

interface NavItemProps {
  icon: IconType;
  children: any;
  url: any;
  currentPath: string;
}
const NavItem = ({ icon, url, children, currentPath, ...rest }: NavItemProps) => {
  const isActive = currentPath === url;

  return (
    <Link to={url} style={{ textDecoration: 'none' }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'cyan.400',
          color: 'white',
        }}
        bg={isActive ? 'cyan.400' : 'transparent'}
        color={isActive ? 'white' : useColorModeValue('gray.800', 'white')}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

interface MobileProps {
  onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      {...rest}
    >
      <IconButton display={{ base: 'flex', md: 'none' }} onClick={onOpen} variant="outline" aria-label="open menu" icon={<FiMenu />} />
      <Text display={{ base: 'flex', md: 'none' }} fontSize="2xl" fontFamily="monospace" fontWeight="bold">
        Logo
      </Text>

      {/* Profile Card */}
      <ProfileCard user={user} />
    </Flex>
  );
};
