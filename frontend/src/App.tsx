import * as React from "react"
import {
  ChakraProvider,
  theme,
} from "@chakra-ui/react"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Chat";
import TestChat from "./pages/TestChat";
import Navbar from "./components/Navbar";

const App = () => {

  return (
    <div>
       <ChakraProvider theme={theme}>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Register />} />
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
