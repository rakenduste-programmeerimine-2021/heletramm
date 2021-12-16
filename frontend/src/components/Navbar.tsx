import {useState, useContext, useEffect, useCallback} from 'react';
import axios from "axios";
import {Spacer, Flex, Text, Avatar, Stack, Center, Menu, MenuButton, MenuList, MenuItem} from '@chakra-ui/react';
import {Button as ChakraButton, chakra} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import {useNavigate} from "react-router-dom";
import {RouteProps, Link} from 'react-router-dom';
import { logoutUser } from "../store/actions";
import { IoIosChatboxes, IoMdArrowRoundUp } from "react-icons/io"
import { FaUser } from "react-icons/fa";
import React from 'react';
import { Context } from "../store/Index";
import { User } from "../pages/Profile";

export interface Props {
  onMenuToggle: (isOpen: boolean) => void;
}

const Person = chakra(FaUser);
const MenuIcon = chakra(HamburgerIcon);
const CloseMenuIcon = chakra(IoMdArrowRoundUp);
const ChatBox = chakra(IoIosChatboxes);

const Navbar: React.FC<RouteProps> = (props: RouteProps) => {

  const [state, dispatch] = useContext(Context);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState();
  const [loggedUser, setLoggedUser] = useState<User>();

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

  const getUser = useCallback(async () => {
    axios.post('http://localhost:3001/me', {username: state.auth.user}, {headers: {
        Authorization: 'Bearer ' + state.auth.token
    }}).then((response) => {
        console.log(response.data);
        setLoggedUser(response.data);
    })
  }, [])
  
  useEffect(() => {

    getUser();

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
              <ChakraButton mr={4} as="a" variant="ghost" aria-label="Home" my={5} w="100%">
                <ChatBox boxSize={8} /> 
              </ChakraButton>
            </Link>

            <Link to="/profile" >
              <ChakraButton as="a" variant="ghost" aria-label="Profile" my={5} w="100%">
                <Person boxSize={8}/> 
              </ChakraButton>
            </Link>

            <Spacer />

            <Menu>
              <MenuButton data-testid="menutogglebutton" as={ChakraButton} onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <MenuIcon /> : <CloseMenuIcon />}
              </MenuButton>
              <MenuList borderColor="#48CAE4" borderWidth={4}>
                  <Center>  
                    <Avatar mb={4} size="lg" name={loggedUser?.username} src="" />
                  </Center>
                  <Center>
                    <Text>Logged in as:</Text>
                  </Center>
                  <Center>
                    <Text mb={4} fontSize="xl">#{loggedUser?.id} {username}</Text>
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
