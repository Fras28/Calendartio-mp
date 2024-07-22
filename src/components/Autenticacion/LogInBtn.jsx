import React from 'react';
import { Button } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const LogInBtn = () => {
  return (
    <Button
      as={RouterLink}
      to="/login"
      bgColor="#6E5E84"
      outline="solid #2E1F13 4px"
      color="#88B9BF"
      _hover={{
        bgColor: "#88B9BF",
        color: "#6E5E84",
        outline: "solid #6E5E84 4px",
      }}
    >
      Identificarte
    </Button>
  );
};

export default LogInBtn;

