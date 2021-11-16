import * as React from "react"
import {
  ChakraProvider,
  theme,
} from "@chakra-ui/react"
import Navbar from "./components/Navbar"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";

const App = () => {

  return (
    <div>
       <ChakraProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navbar />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Register />} />
          </Routes>
          </BrowserRouter>
        <Navbar/>
      </ChakraProvider>
    </div>

   
  )

  
}

export default App;
