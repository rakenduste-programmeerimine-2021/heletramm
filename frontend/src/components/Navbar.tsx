import {useState, useContext, useEffect} from 'react';
import {useColorMode, Spacer, Switch, Box, Flex, Text, Heading, Stack} from '@chakra-ui/react';
import {Button as ChakraButton} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import {useNavigate} from "react-router-dom";
import {RouteProps, Link} from 'react-router-dom';
import { logoutUser } from "../store/actions";
import React from 'react';
import {Context} from "../store";


const Navbar: React.FC<RouteProps> = (props: RouteProps) => {

  const [state, dispatch] = useContext(Context);
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState();

  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    setLoggedIn(false);
    navigate("/login");
  }

  
  useEffect(() => {

    console.log(state.auth.token);

    if (state.auth.token != null && state.auth.token != undefined) {
      setLoggedIn(true);
      setUsername(localStorage.getItem("user"));
    }
  }, [])


  return (
    <div>
        <Flex as="nav" justify="space-between" wrap="wrap" top="1rem" right="1rem" align="center" backgroundColor="#D8DDEF" borderRadius={8}>
          <Stack direction={{ base: "column", md: "row" }} width={{ base: "full", md: "auto" }} alignItems="center" flexGrow={1} mt={{ base: 4, md: 0 }} ml={4}>
            <Link to="/" >
              <ChakraButton as="a" variant="ghost" aria-label="Home" my={5} w="100%">
                Home
              </ChakraButton>
            </Link>

            <Link to="/about">
              <ChakraButton as="a" variant="ghost" aria-label="About" my={5} w="100%">
                About
              </ChakraButton>
            </Link>

            <Link to="/contact">
              <ChakraButton as="a" variant="ghost" aria-label="Contact" my={5} w="100%">
                Contact
              </ChakraButton>
            </Link>

            <Spacer />

              { loggedIn ? 
              <span><Text mr={8}>Signed in as: {username}</Text>
              <ChakraButton onClick={handleLogout}>Log out</ChakraButton></span> :
              
                <Link to="/login" >
                  <ChakraButton as="a" variant="ghost" aria-label="Contact" my={5} w="100%">
                    Sign in
                  </ChakraButton>
                </Link>}

                {/* // <Link to="/signup">
                //   <Button as="a" variant="ghost" aria-label="Contact" my={5} w="100%">
                //     Sign up
                //   </Button>
                // </Link> */}
            </Stack>
        </Flex>
     </div>
  )
}

export default Navbar;