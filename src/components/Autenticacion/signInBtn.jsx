import React from 'react';
import { Button } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const SignInBtn = () => {
  return (
    <Button
      as={RouterLink}
      to="/register"
      bgColor="#6E5E84"
      outline="dashed #2E1F13 4px"
      color="#88B9BF"
      _hover={{
        bgColor: "#88B9BF",
        color: "#6E5E84",
        outline: "dashed #6E5E84 4px",
      }}
    >
      Registrarte
    </Button>
  );
};

export default SignInBtn;

