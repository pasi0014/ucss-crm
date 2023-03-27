import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { NavLink } from "react-router-dom";

interface IError {
  invalidFirstName?: boolean;
  invalidLastName?: boolean;
  invalidEmail?: boolean;
  invalidPhone?: boolean;
  invalidPassword?: boolean;
}

export default function SignupCard() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  const [errorMessage, setErrorMessage] = useState("");

  const validatePassword = () => {
    // Check if the password is at least 7 characters long
    if (password?.length < 7) {
      setErrorMessage("Password must be at least 7 characters long");
      return false;
    }

    // Check if the password contains at least 1 uppercase letter
    if (!/[A-Z]/.test(password)) {
      setErrorMessage("Password must contain at least 1 uppercase letter");
      return false;
    }

    // Check if the password contains at least 1 special character
    if (!/[^a-zA-Z0-9]/.test(password)) {
      setErrorMessage("Password must contain at least 1 special character");
      return false;
    }

    // Check if the password and confirm password match
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return false;
    }

    return true;
  };

  const validateForm = () => {
    const errors: IError = {};

    if (!firstName?.length) {
      errors.invalidFirstName = true;
    }

    if (!lastName?.length) {
      errors.invalidLastName = true;
    }

    if (!validatePassword()) {
      errors.invalidPassword = true;
    }

    return !Object.keys(errors).length;
  };

  const doRegister = async () => {
    try {
      console.log("Trying to create a user");
    } catch (error) {
      console.error("Unexpected error while trying to create a user", {
        error,
      });
    }
  };

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Sign up
          </Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            to enjoy all of our cool features ✌️
          </Text>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <HStack>
              <Box>
                <FormControl id="firstName" isRequired>
                  <FormLabel>First Name</FormLabel>
                  <Input type="text" />
                </FormControl>
              </Box>
              <Box>
                <FormControl id="lastName">
                  <FormLabel>Last Name</FormLabel>
                  <Input type="text" />
                </FormControl>
              </Box>
            </HStack>
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input type="email" />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input type={showPassword ? "text" : "password"} />
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Submitting"
                size="lg"
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
              >
                Sign up
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={"center"}>
                Already a user?{" "}
                <NavLink to="/login">
                  {" "}
                  <Link color={"blue.400"}>Login</Link>
                </NavLink>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
