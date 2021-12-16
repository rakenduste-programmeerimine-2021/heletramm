import React, {useState, useContext, useEffect} from 'react';
import { Context } from '../store/Index';
import { FormControl, FormLabel, FormHelperText} from '@chakra-ui/form-control';
import {Flex, Box, Heading, Button, Link, Divider, chakra, Text, Center} from "@chakra-ui/react";
import { FaLock, FaMailBulk } from 'react-icons/fa';
import { Input, InputGroup, InputLeftElement } from '@chakra-ui/input';
import axios from "axios";
import { loginUser } from '../store/actions';
import { useNavigate } from "react-router-dom";
import { Error } from './Chat';
import { Navigate } from 'react-router';

const UserAlt = chakra(FaMailBulk);
const Lock = chakra(FaLock);

interface User {
    id: number,
    email: string,
    token: string,
    user: string
}

export interface Props {
    onEmailChange: (email: string) => void;
    onPasswordChange: (password: string) => void;
    onSubmit: (email: string, password: string) => void;
}

const Login: React.FC<Props> = (props: Props) => {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [token, setToken] = useState("");
    const [nickname, setNickname] = useState("");
    const [id, setId] = useState<number>();
    const [loggedIn, setLoggedIn] = useState(false);
    const [error, setError] = useState<Error>();
    const [dispatch] = useContext(Context);

  
    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        props.onSubmit(email, password);

        axios.post("http://localhost:3001/login", {
            email: email,
            password: password
        }, {withCredentials: true}).then((response) => {

            if (response.data.token != undefined && response.data.token != null) {
                console.log(response.data.token);
                setId(response.data.user.id);
                setEmail(response.data.user.email);
                setToken(response.data.token);
                setNickname(response.data.user.username);
                if (!response.data.token) return;
                window.location.reload(false);
            }

        }).catch((err) => {
            const error = err.response.data.error;
            console.log(error);
            setError(error);
        })

        const user: User = {
            id: id!,
            email: email,
            token: token,
            user: nickname
        }

        if (user.token != null && user.user != null && user.email != null && user.id != null) {
            setLoggedIn(true);
            dispatch(loginUser(user));
        }

        <Navigate to="/chat" />
    }

    return (
        <div>
            <Flex width="full" minH="100vh" align="center" justifyContent="center" backgroundColor="#023E8A">
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
                                        children={<UserAlt color="black" />}
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
                                        children={<Lock color="black" />}
                                    />
                                    <Input data-testid="password" outlineColor="blackAlpha.800" type="password" id="password" onChange={e => {setPassword(e.currentTarget.value); props.onPasswordChange(e.currentTarget.value)}} />
                                </InputGroup>
                                <FormHelperText>Don't ever share your password with anyone</FormHelperText>
                            </FormControl>
                            <Button data-testid="submit" width="full" mt={4} type="submit" bgColor="#0096C7">
                                Sign In
                            </Button>
                        </form>
                    </Box>
                    <Divider borderColor="#023E8A" />
                    <Box mt={6} textAlign="center">
                        <Center mt={4}>
                            <Text color="red.500" fontSize={16}>{error}</Text>
                        </Center>
                        <br />
                        Don't have an account yet?
                        <br />
                        <Link href="/signup" color="#0096C7">
                            Sign up
                        </Link>
                    </Box>
                </Box>
            </Flex>
        </div>
    )
}

export default Login;