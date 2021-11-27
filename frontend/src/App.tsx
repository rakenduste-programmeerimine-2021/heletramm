import * as React from "react"
import {
  ChakraProvider,
  theme,
} from "@chakra-ui/react"
import Navbar from "./components/Navbar"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";

const App = () => {

  return (
    <div>
       <ChakraProvider theme={theme}>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Register />} />
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
