import {useState, useContext, useEffect} from 'react';
import axios from "axios";
import {Spacer, Flex, Text, Avatar, Stack, Center, Menu, MenuButton, MenuList, MenuItem} from '@chakra-ui/react';
import {Button as ChakraButton, chakra} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import {useNavigate} from "react-router-dom";
import {RouteProps, Link} from 'react-router-dom';
import { logoutUser } from "../store/actions";
import { IoIosChatboxes, IoMdArrowRoundUp } from "react-icons/io"
import React from 'react';
import {Context} from "../store/Index";

const MenuIcon = chakra(HamburgerIcon);
const CloseMenuIcon = chakra(IoMdArrowRoundUp);
const ChatBox = chakra(IoIosChatboxes);


const Navbar: React.FC<RouteProps> = (props: RouteProps) => {

  const [state, dispatch] = useContext(Context);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState();

  const navigate = useNavigate();

  const handleLogout = async () => {
    console.log(state.auth.token);
    const response = await axios.get("http://localhost:3001/logout", {withCredentials: true});
    console.log(JSON.stringify(response.data));
    dispatch(logoutUser());
    setLoggedIn(false);
    navigate("/login");
    window.location.reload(false);
  }

  
  useEffect(() => {

    console.log(state.auth.token);
    console.log(state.auth.user);

    if (state.auth.user != undefined) {
      setLoggedIn(true);
      setUsername(state.auth.user);
    }
  }, [])


  return (
    <div>
      <Flex as="nav" justify="space-between" wrap="wrap" right="1rem" align="center" backgroundColor="#0077B6">
          <Stack direction={{ base: "column", md: "row" }} width={{ base: "full", md: "auto" }} alignItems="center" flexGrow={1} ml={12} mr={12}>
            <Link to="/" >
              <ChakraButton as="a" variant="ghost" aria-label="Home" my={5} w="100%">
                <ChatBox boxSize={8} /> 
              </ChakraButton>
            </Link>

            <Spacer />

            <Menu>
              <MenuButton as={ChakraButton} onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <MenuIcon /> : <CloseMenuIcon />}
              </MenuButton>
              <MenuList borderColor="#48CAE4" borderWidth={4}>
                  <Center>  
                    <Avatar mb={4} size="lg" name={username} src="" />
                  </Center>
                  <Center>
                    <Text mb={4} fontSize="xl">{username}</Text>
                  </Center>
                  <Center>
                    <ChakraButton onClick={handleLogout}>Log out</ChakraButton>
                  </Center>
              </MenuList>
            </Menu>
            
                
          </Stack>
      </Flex> 
    </div>
  )
}

export default Navbar;


// <MenuButton isActive={menuOpen} bg="#0077B6" alignContent="center" onClick={() => setMenuOpen(!menuOpen)}>
                //   <Menu boxSize={8} />
                // </MenuButton> : 
                    
              // <span><Text mr={8}>Signed in as: {username}</Text>
              // </span> :
                
                // <ChakraButton onClick={() => setMenuOpen(!menuOpen)}>
                //   <CloseMenu boxSize={8} />
                // </ChakraButton>
                  
                
                // <Link to="/login" >
                //   <ChakraButton as="a" variant="ghost" aria-label="Contact" my={5} w="100%">
                //     Sign in
                //   </ChakraButton>
                // </Link>



// : 


            
            // 
            
            // }