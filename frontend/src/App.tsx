import React, {useEffect, useContext, useState} from "react"
import {
  ChakraProvider,
  theme,
  Heading
} from "@chakra-ui/react"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {Context} from "../src/store"
import {loginUser} from "../src/store/actions";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Chat";
import TestChat from "./pages/TestChat";
import Navbar from "./components/Navbar";
import axios from "axios";
import jwtDecode from "jwt-decode";

const App: React.FC = () => {

  const [state, dispatch] = useContext(Context);
  const [token, setToken] = useState("");
  const [showNavbar, setShowNavbar] = useState(true);

  const getRefreshToken = async () => {
    const response = await axios.get("http://localhost:3001/refresh_token", {withCredentials: true});
    console.log(response.data);
    setToken(response.data.token);

    const refreshToken = {
      token: response.data.token,
      user: response.data.user
    }

    if (response.data.token != null) {

      dispatch(loginUser(refreshToken));
    }
  }

  useEffect(() => {
    getRefreshToken();
    if (state.auth.token == "") {
      setShowNavbar(false);
    }

    console.log(token);
  },[])

  if (state.auth.token == null || state.auth.token == undefined) {
    return <Heading>Loading...</Heading>
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
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Register onUsernameChange={empty} onEmailChange={empty} onPasswordChange={empty} onSubmit={empty} />} />
            <Route path="/testchat" element={<TestChat/>}/>
          </Routes>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
          </BrowserRouter>
      </ChakraProvider>
    </div>

   
  )

  
}

export default App;
