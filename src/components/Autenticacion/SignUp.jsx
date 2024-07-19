import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { registerUser } from '../redux/slice';
import { Navigate, NavLink } from 'react-router-dom';
import InicioButton from '../InicioButton';

export default function SignupCard() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [telefono, setTelefono] = useState('');
  const dispatch = useDispatch();
  const toast = useToast();
  const status = useSelector((state) => state.reservas.status);
  const [RegisterSuccess, setRegisterSuccess] = useState(false);

  const bgValue = useColorModeValue('gray.50', 'gray.800');
  const boxBgValue = useColorModeValue('white', 'gray.700');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(registerUser({
        username,
        email,
        password,
        telefono,
      })).unwrap();
      toast({
        title: 'Account created.',
        description: "We've created your account for you.",
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setRegisterSuccess(true)
    } catch (error) {
      toast({
        title: 'Registration failed.',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (RegisterSuccess) {
    return <Navigate to="/login" />;
  }

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={bgValue}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Regístrate
          </Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
           Para disfrutar al maximo nuestra web ✌️
          </Text>
        </Stack>
        <Box
          rounded={'lg'}
          bg={boxBgValue}
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={4} as="form" onSubmit={handleSubmit}>
            <FormControl id="username" isRequired>
              <FormLabel>Usuario</FormLabel>
              <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            </FormControl>
            <FormControl id="email" isRequired>
              <FormLabel>Email</FormLabel>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Contraseña</FormLabel>
              <InputGroup>
                <Input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() => setShowPassword((showPassword) => !showPassword)}>
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <FormControl id="telefono" isRequired>
              <FormLabel>Telefono</FormLabel>
              <Input type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                type="submit"
                loadingText="Submitting"
                size="lg"
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}
                isLoading={status === 'loading'}
              >
                Registrar
              </Button>
              <InicioButton/>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'}>
               Ya estas registrado ? <NavLink  to="/login" style={{color:"#3182CE"}}>Identificarme</NavLink>
              </Text>
            </Stack>                                    
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
