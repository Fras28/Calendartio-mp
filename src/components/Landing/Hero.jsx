import React, { useRef } from 'react';
import { Parallax } from 'react-parallax';
import { Box, Button, Heading, Text, useMediaQuery } from '@chakra-ui/react';
import { BiBasket } from 'react-icons/bi';
import bgImg from "../assets/fondo.jpg";
import Prestadores from '../Prestadores';
import Logo from "../assets/VARIANTE-11.png"

const HeroSection = () => {
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const prestadoresRef = useRef(null);

  const scrollToPrestadores = () => {
    prestadoresRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const content = (
    <Box className='boxHero' display="flex" justifyContent="center" alignItems="center" bg="rgba(0, 0, 0, 0.5)" minH="70vh">
      <Box textAlign="center" color="white" position="relative">
        <Heading
          as="h1"
          size="2xl"
          mb="4"
          sx={{ 
            WebkitTextStroke: "2px #2e1f13",
            fontFamily: "Berkshire Swash, serif",
            display:"flex",
            justifyContent:"center"
          }}
        >
          <img src={Logo} alt="Logo" width="30%" style={{backgroundColor:"#000000b5", borderRadius:"50%"}} className='buttonHero'/>
        </Heading>
        <Text fontSize="32px" mb="6" className='titMai'>
          Maia Magical World
        </Text>
        <Button  style={{backgroundColor:"#88B9BF", border:"solid #6E5E84 4px", borderRadius:"12px", color:"#6E5E84" }} size="lg" leftIcon={<BiBasket />} onClick={scrollToPrestadores}>
          Hacer Reserva
        </Button>
        <Text fontSize="l" mb="6">
          Tarot | Vitki | Carta Natal
        </Text>
      </Box>
    </Box>
  );

  return (
    <>
      {isMobile ? (
        <Box
          className='mobile-container'
          bgImage={`url(${bgImg})`}
          bgSize="cover"
          bgPos="center"
          minH="70vh"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          {content}
        </Box>
      ) : (
        <Parallax
          bgImage={bgImg}
          strength={500}
          bgImageStyle={{
            left: '50%',
            transform: 'translate3d(-50%, -53.1804px, 0px)',
            transformStyle: 'preserve-3d',
            backfaceVisibility: 'hidden',
            minHeight: '28vh',
            height: 'auto',
            width: '1920px',
            filter: 'none',
          }}
          className='parallax-container'
        >
          {content}
        </Parallax>
      )}
      <Box mt={10} ref={prestadoresRef}>
        <Prestadores />
      </Box>
    </>
  );
};

export default HeroSection;
