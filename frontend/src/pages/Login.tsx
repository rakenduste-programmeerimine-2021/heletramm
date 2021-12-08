import React, {useState, useContext, useEffect} from 'react';
import { Context } from '../store/Index';
import { FormControl, FormLabel, FormHelperText} from '@chakra-ui/form-control';
import {Flex, Box, Heading, Button, Link, Divider, chakra} from "@chakra-ui/react";
import { FaLock, FaMailBulk } from 'react-icons/fa';
import { Input, InputGroup, InputLeftElement } from '@chakra-ui/input';
import axios from "axios";
import { loginUser } from '../store/actions';
import { useNavigate } from "react-router-dom";

const UserAlt = chakra(FaMailBulk);
const Lock = chakra(FaLock);

interface User {
    token: string,
    user: string
}

export interface Props {
    onEmailChange: (email: string) => void;
    onPasswordChange: (password: string) => void;
    onSubmit: (email: string, password: string) => void;
}

const Login: React.FC<Props> = (props: Props) => {

    //const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [token, setToken] = useState("");
    const [nickname, setNickname] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);
    //const [state, dispatch] = useContext(Context);

    useEffect(() => {
       
    }, [])

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        props.onSubmit(email, password);

        const response =  await axios.post("http://localhost:3001/login", {
            email: email,
            password: password
        }, {withCredentials: true})

        if (response.data.token != undefined && response.data.token != null) {
            setToken(response.data.token);
            setNickname(response.data.username);
            if (!response.data.token) return;
        }
        
        const user: User = {
            token: token,
            user: nickname
        }

        if (user.token != null && user.user != null) {
            setLoggedIn(true);
        }
        
        //await dispatch(loginUser(user));

        //navigate("/");
        window.location.reload(false);
    }

    

    return (
        <div>
            <Flex width="full" minH="100vh" align="center" justifyContent="center" backgroundColor="#45B69C">
                <Box p={20} borderWidth={2} borderRadius={8} boxShadow="lg" backgroundColor="whiteAlpha.800">
                    <Box textAlign="center" mb={14}>
                        <Heading>Login</Heading>
                    </Box>
                    <Box my={4} textAlign="left">
                        <form onSubmit={handleSubmit} data-testid="login-form">
                            <FormControl id="email" isRequired mb={4}>
                                <FormLabel>Email address</FormLabel>
                                <InputGroup>
                                    <InputLeftElement
                                        pointerEvents="none"
                                        children={<UserAlt color="gray.300" />}
                                    />
                                    <Input data-testid="email" outlineColor="blackAlpha.800" type="email" id="email" onChange={e => {setEmail(e.currentTarget.value); props.onEmailChange(e.currentTarget.value)}} />
                                </InputGroup>
                                <FormHelperText>We'll never share your email</FormHelperText>
                            </FormControl>
                            <FormControl id="password" isRequired>
                                <FormLabel>Password</FormLabel>
                                <InputGroup>
                                    <InputLeftElement
                                        pointerEvents="none"
                                        children={<Lock color="gray.300" />}
                                    />
                                    <Input data-testid="password" outlineColor="blackAlpha.800" type="password" id="password" onChange={e => {setPassword(e.currentTarget.value); props.onPasswordChange(e.currentTarget.value)}} />
                                </InputGroup>
                                <FormHelperText>Don't ever share your password with anyone</FormHelperText>
                            </FormControl>
                            <Button data-testid="submit" width="full" mt={4} type="submit" bgColor="#45B69C">
                                Sign In
                            </Button>
                        </form>
                    </Box>
                    <Divider />
                    <Box mt={6} textAlign="center">
                        Don't have an account yet?
                        <br />
                        <Link href="/signup" color="#21D19F">
                            Sign up
                        </Link>
                    </Box>
                </Box>
            </Flex>
        </div>
    )
}

export default Login;


//Colors

//  D8DDEF
//  A0A4B8
//  7293A0
//  45B69C
//  21D19F
//  3A405A