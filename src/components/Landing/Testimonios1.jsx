import React, { useEffect, useState } from 'react';
import { Parallax } from 'react-parallax';
import { Box, useMediaQuery } from '@chakra-ui/react';
import bgImg from "../assets/fontoTest.jpeg";
import WithSpeechBubbles from './Testimonios';
import NuevaReserva from '../NuevaReserva';
import SignInBtn from '../Autenticacion/signInBtn';

const Testim = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [isMobile] = useMediaQuery("(max-width: 768px)");

  const openModal = () => {
    setModalOpen(true);
  }

  const closeModal = () => {
    setModalOpen(false);
  }

  return (
    <>
      {isMobile ? (
        <Box
          bgImage={`url(${bgImg})`}
          bgSize="cover"
          bgPos="center"
          minH="70vh"
          display="flex"
          justifyContent="center"
          alignItems="center"
          className="testim-mobile-container"
        >
          <WithSpeechBubbles />
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
            minHeight:'28vh',
            height: 'auto',
            width: '100%',
            filter: 'none',        
          }}
          className='testim-parallax-container'
        >
          <Box height="70dvh" display="flex" justifyContent="center" alignItems="center" bg="rgba(0, 0, 0, 0.5)">
            <WithSpeechBubbles />
          </Box>
        
        </Parallax>
      )}
      {modalOpen && (
        <div className="testim-modal">
          <div className="testim-modal-content">
            <span className="testim-close" onClick={closeModal}>&times;</span>
            <NuevaReserva />
          </div>
        </div>
      )}
    </>
  );
};
export default Testim;