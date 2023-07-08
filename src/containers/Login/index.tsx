import { useContext, useState } from 'react';

import { Box, Stack, Heading, Text, Container, Input, Button, SimpleGrid, FormControl, FormLabel, useBreakpointValue, Icon } from '@chakra-ui/react';
import { useSignIn } from 'react-auth-kit';
import { NavLink, useNavigate } from 'react-router-dom';
import { useColorModeValue } from '@chakra-ui/react';

import MessageBar, { IMessageBar } from '../../components/MessageBar';

import { loginUser } from './calls';

import './styles.scss';
import { StatusContext } from '../../context/StatusContext';

export default function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const [messageBar, setMessageBar] = useState<IMessageBar>({
    type: 'info',
    message: '',
  });

  const signIn = useSignIn();
  const navigate = useNavigate();

  const doLogin = async () => {
    const logContext = {
      component: 'containers/Login/index.doLogin',
    };

    setLoading(true);

    try {
      const response = await loginUser(email, password);

      if (!response.success) {
        throw new Error('Error while logging in the user');
      }

      if (response.success) {
        signIn({
          token: response.data.accessToken,
          expiresIn: 10_800,
          tokenType: 'Bearer',
          authState: { email },
        });
      }

      navigate('/');
    } catch (error: any) {
      setLoading(false);
      setError(true);
      setMessageBar({
        type: 'error',
        message: error.message,
      });
      console.error('Unexpected error while trying to login the user', {
        ...logContext,
        error,
      });
    }
    setLoading(false);
  };

  return (
    <>
      <Box position={'relative'}>
        <Container as={SimpleGrid} maxW={'7xl'} columns={{ base: 1, md: 2 }} spacing={{ base: 10, lg: 32 }} py={{ base: 10, sm: 20, lg: 32 }}>
          <Stack spacing={{ base: 10, md: 20 }}>
            <Heading lineHeight={1.1} fontSize={{ base: '3xl', sm: '4xl', md: '5xl', lg: '6xl' }}>
              Client Relationship Management System
            </Heading>
          </Stack>
          <Stack bg={useColorModeValue('gray.50', 'gray.700')} rounded={'xl'} p={{ base: 4, sm: 6, md: 8 }} spacing={{ base: 8 }} maxW={{ lg: 'lg' }}>
            <Stack spacing={4}>
              <Heading color={useColorModeValue('gray.800', 'gray.100')} lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}>
                Login
              </Heading>
              <Text color={'gray.500'} fontSize={{ base: 'sm', sm: 'md' }}>
                Let us authenticate you first ✌️
              </Text>
              {error && <MessageBar type={messageBar.type} message={messageBar.message} />}
            </Stack>

            <Box as={'form'} mt={10}>
              <Stack spacing={4}>
                <FormControl isInvalid={error} isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input
                    placeholder="email@example.com"
                    type="email"
                    bg={'gray.100'}
                    border={0}
                    color={'gray.500'}
                    _placeholder={{
                      color: 'gray.500',
                    }}
                    value={email}
                    onChange={(event: any) => setEmail(event.target.value)}
                  />
                </FormControl>

                <FormControl isInvalid={error} isRequired>
                  <FormLabel>Password</FormLabel>
                  <Input
                    placeholder="Password"
                    type="password"
                    bg={'gray.100'}
                    border={0}
                    color={'gray.500'}
                    _placeholder={{
                      color: 'gray.500',
                    }}
                    value={password}
                    onChange={(event: any) => {
                      setPassword(event.target.value);
                    }}
                  />
                </FormControl>
              </Stack>
              <Button
                fontFamily={'heading'}
                mt={8}
                w={'full'}
                bgGradient="linear(to-r, red.400,pink.400)"
                color={'white'}
                _hover={{
                  bgGradient: 'linear(to-r, red.400,pink.400)',
                  boxShadow: 'xl',
                }}
                isLoading={loading}
                onClick={() => {
                  doLogin();
                }}
              >
                Sign in
              </Button>
            </Box>
            <Stack pt={2}>
              <Text align={'center'}>
                New user?{' '}
                <NavLink color={'blue.400'} to="/register">
                  Sign Up
                </NavLink>
              </Text>
            </Stack>
          </Stack>
        </Container>
        <Blur position={'absolute'} top={-10} left={-10} style={{ filter: 'blur(70px)' }} />
      </Box>
    </>
  );
}

export const Blur = (props: any) => {
  return (
    <Icon
      width={useBreakpointValue({ base: '100%', md: '40vw', lg: '30vw' })}
      zIndex={useBreakpointValue({ base: -1, md: -1, lg: 0 })}
      height="560px"
      viewBox="0 0 528 560"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="71" cy="61" r="111" fill="#3498db" />
      <circle cx="244" cy="106" r="109" fill="#3498db" />
      <circle cy="291" r="139" fill="#ffdb58" />
      <circle cx="80.5" cy="189.5" r="101.5" fill="#3498db" />
      <circle cx="70.5" cy="458.5" r="101.5" fill="#ffdb58" />
    </Icon>
  );
};
