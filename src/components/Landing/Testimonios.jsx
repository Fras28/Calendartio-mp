import React from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Stack,
  Container,
  Avatar,
  useColorModeValue,
} from '@chakra-ui/react';
import { ParallaxProvider, Parallax } from 'react-scroll-parallax';

const Testimonial = ({ children }) => {
  return <Box>{children}</Box>;
};

const TestimonialContent = ({ children }) => {
  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      boxShadow={'lg'}
      p={8}
      rounded={'xl'}
      align={'center'}
      pos={'relative'}
      _after={{
        content: `""`,
        w: 0,
        h: 0,
        borderLeft: 'solid transparent',
        borderLeftWidth: 16,
        borderRight: 'solid transparent',
        borderRightWidth: 16,
        borderTop: 'solid',
        borderTopWidth: 16,
        borderTopColor: useColorModeValue('white', 'gray.800'),
        pos: 'absolute',
        bottom: '-16px',
        left: '50%',
        transform: 'translateX(-50%)',
      }}>
      {children}
    </Stack>
  );
};

const TestimonialHeading = ({ children }) => {
  return (
    <Heading as={'h3'} fontSize={'xl'} >
      {children}
    </Heading>
  );
};

const TestimonialText = ({ children }) => {
  return (
    <Text
      textAlign={'center'}
      color={useColorModeValue('gray.600', 'gray.400')}
      fontSize={'sm'}>
      {children}
    </Text>
  );
};

const TestimonialAvatar = ({ src, name, title }) => {
  return (
    <Flex align={'center'} mt={8} direction={'column'}>
      <Avatar src={src} mb={2} />
      <Stack spacing={-1} align={'center'}>
        <Text fontWeight={600} color={"whitesmoke"}>{name}</Text>
        <Text fontSize={'sm'} color={"whitesmoke"}>
          {title}
        </Text>
      </Stack>
    </Flex>
  );
};

export default function WithSpeechBubbles() {
  return (
    <ParallaxProvider>
      <Box className='testimonios-content'>
        <Container maxW={'7xl'} py={16} as={Stack} spacing={12}>
          <Stack spacing={0} align={'center'}>
            <Heading  color={'whitesmoke'}> Our Clients Speak</Heading>
            <Text color={'whitesmoke'}>We have been working with clients around the world</Text>
          </Stack>
          <Stack
            direction={{ base: 'column', md: 'row' }}
            spacing={{ base: 10, md: 4, lg: 10 }}>
            <Parallax className="custom-class" y={[-20, 20]} tagOuter="figure">
              <Testimonial>
                <TestimonialContent>
                  <TestimonialHeading>Efficient Collaborating</TestimonialHeading>
                  <TestimonialText>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Auctor neque sed
                    imperdiet nibh lectus feugiat nunc sem.
                  </TestimonialText>
                </TestimonialContent>
                <TestimonialAvatar
                  src={
                    'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
                  }
                  name={'Jane Cooper'}
                  title={'CEO at ABC Corporation'}
                />
              </Testimonial>
            </Parallax>
            <Parallax className="custom-class" y={[-20, 20]} tagOuter="figure">
              <Testimonial>
                <TestimonialContent>
                  <TestimonialHeading>Intuitive Design</TestimonialHeading>
                  <TestimonialText>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Auctor neque sed
                    imperdiet nibh lectus feugiat nunc sem.
                  </TestimonialText>
                </TestimonialContent>
                <TestimonialAvatar
                  src={
                    'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
                  }
                  name={'Jane Cooper'}
                  title={'CEO at ABC Corporation'}
                />
              </Testimonial>
            </Parallax>
            <Parallax className="custom-class" y={[-20, 20]} tagOuter="figure">
              <Testimonial>
                <TestimonialContent>
                  <TestimonialHeading>Mindblowing Service</TestimonialHeading>
                  <TestimonialText>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Auctor neque sed
                    imperdiet nibh lectus feugiat nunc sem.
                  </TestimonialText>
                </TestimonialContent>
                <TestimonialAvatar
                  src={
                    'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
                  }
                  name={'Jane Cooper'}
                  title={'CEO at ABC Corporation'}
                />
              </Testimonial>
            </Parallax>
          </Stack>
        </Container>
      </Box>
    </ParallaxProvider>
  );
}
