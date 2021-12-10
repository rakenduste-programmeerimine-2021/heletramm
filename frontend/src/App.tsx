import React, {useEffect, useContext, useState} from "react"
import {
  ChakraProvider,
  theme,
  Flex,
  Center,
  Text
} from "@chakra-ui/react"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {Context} from "./store/Index"
import {loginUser} from "../src/store/actions";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import TestChat from "./pages/TestChat";
import Navbar from "./components/Navbar";
import axios from "axios";
import PrivateRoute from "./components/PrivateRoute";
import ClipLoader from "react-spinners/ClipLoader";

const App: React.FC = () => {

  const [state, dispatch] = useContext(Context);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);

  const getRefreshToken = async () => {
    const response = await axios.get("http://localhost:3001/refresh_token", {withCredentials: true});
    
    const refreshToken = {
      token: response.data.token,
      user: response.data.user
    }

    if (response.data.success = "true") {
      dispatch(loginUser(refreshToken));
      setIsLoggedIn(true);
    }

    if (response.data.user == null || response.data.user == undefined) {
      setShowNavbar(false);
      setIsLoggedIn(false);
    }
  }

  useEffect(() => {
    getRefreshToken();
  },[])

  if (state.auth.token == null || state.auth.token == undefined) {
    return (
      <ChakraProvider theme={theme}>
        <Flex w="full" minH="100vH" justifyContent='center' backgroundColor="#45B69C">   
          <Center>
            <ClipLoader size={120} />
          </Center>
        </Flex>
      </ChakraProvider>
    )
  }

  function empty() {
    return;
  }


  return (
    <div>
       <ChakraProvider theme={theme}>
        <BrowserRouter>
          {showNavbar ? <Navbar /> : null}
          <Routes>
            <Route path="/login" element={<Login onEmailChange={empty} onPasswordChange={empty} onSubmit={empty}/>} />
            <Route path="/signup" element={<Register onUsernameChange={empty} onEmailChange={empty} onPasswordChange={empty} onSubmit={empty} />} />
          </Routes>
          <Routes>
            <Route 
              path="/" 
              element={
                <PrivateRoute isLoggedIn={isLoggedIn}>
                  <Chat onAddFriendChange={empty} onMessageSubmit={empty} onAddFriendToggle={empty} onGetFriends={empty} onRenderingChat={empty} onAddFriendSubmit={empty}/>
                </PrivateRoute>} />
            <Route 
              path="/testchat" 
              element={
                <PrivateRoute isLoggedIn={isLoggedIn}>
                  <TestChat />
                </PrivateRoute>} />
          </Routes>
          </BrowserRouter>
      </ChakraProvider>
    </div>

   
  )

  
}

export default App;
