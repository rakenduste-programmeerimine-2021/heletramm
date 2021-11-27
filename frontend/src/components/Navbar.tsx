import {useState} from 'react';
import {useColorMode, Spacer, Switch, Box, Flex, Button, IconButton} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { Link } from '@chakra-ui/layout';
import {RouteProps} from 'react-router-dom';
import React from 'react';



const Navbar: React.FC<RouteProps> = (props: RouteProps) => {
  
  return (
    <div>
      <Flex marginBottom={8}>
        <Flex position="fixed" top="1rem" right="1rem" left="1rem" align="center" backgroundColor="burlywood" borderRadius={8}>
            <Link href="/" passHref marginLeft="2rem">
              <Button as="a" variant="ghost" aria-label="Home" my={5} w="100%">
                Home
              </Button>
              </Link>

            <Link href="/about" passHref>
              <Button as="a" variant="ghost" aria-label="About" my={5} w="100%">
                About
              </Button>
            </Link>

            <Link href="/contact" passHref>
              <Button as="a" variant="ghost" aria-label="Contact" my={5} w="100%">
                Contact
              </Button>
            </Link>

            <Spacer />

              <Link href="/login" passHref marginRight="2rem">
                <Button as="a" variant="ghost" aria-label="Contact" my={5} w="100%">
                  Sign in
                </Button>
              </Link>

              <Link href="/signup" passHref marginRight="2rem">
                <Button as="a" variant="ghost" aria-label="Contact" my={5} w="100%">
                  Sign up
                </Button>
              </Link>
        </Flex>
      </Flex>
     </div>
  )
}

export default Navbar;