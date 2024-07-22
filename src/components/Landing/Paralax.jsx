// Importa las dependencias necesarias
import React from 'react';
import { Box, Image, ChakraProvider } from '@chakra-ui/react';
import { Parallax, ParallaxLayer } from '@react-spring/parallax';
import EspadaIzquierda from './assets/leftSword.png'; // Asegúrate de tener esta imagen
import EspadaDerecha from './assets/rightSword.png'; // Asegúrate de tener esta imagen
import Esfera from './assets/esfera.png'; 
import Fondo from './assets/fondo.jpg'; // Asegúrate de tener esta imagen

const ParallaxComponent = () => {
  return (
    <ChakraProvider>
      <Box height="100vh" width="100vw" position="relative" overflow="hidden" >
        <Parallax pages={2}>
          <ParallaxLayer offset={0} speed={0.2}>
            <Image src={Fondo} alt="Fondo" width="100%" height="auto" />
          </ParallaxLayer>

          <ParallaxLayer offset={0.1} speed={0.5}>
            <Image src={EspadaIzquierda} alt="Espada Izquierda" position="absolute" left="10%" top="30%" />
          </ParallaxLayer>

          <ParallaxLayer offset={0.1} speed={0.5}>
            <Image src={EspadaDerecha} alt="Espada Derecha" position="absolute" right="10%" top="30%" />
          </ParallaxLayer>

          <ParallaxLayer offset={0.1} speed={0.3}>
            <Image src={Esfera} alt="Esfera" position="absolute" left="50%" top="20%" transform="translateX(-50%)" />
          </ParallaxLayer>

          <ParallaxLayer offset={1} speed={1}>
            <Box bg="teal.500" height="100vh" display="flex" justifyContent="center" alignItems="center">
              <h1 style={{ color: 'white', fontSize: '3rem' }}>Página 2</h1>
            </Box>
          </ParallaxLayer>
        </Parallax>
      </Box>
    </ChakraProvider>
  );
};

export default ParallaxComponent;