import React, {useState} from 'react';
import axios from 'axios';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import {Flex, Box, Heading, Button, Stack, Link, Divider, chakra} from '@chakra-ui/react';
import { FaLock, FaMailBulk, FaUser } from 'react-icons/fa';
import { BsPerson } from "react-icons/bs";
import { Input, InputGroup, InputLeftElement } from '@chakra-ui/input';
import { useNavigate } from 'react-router';
import { useToast } from '@chakra-ui/toast';

const Person = chakra(BsPerson);
const Lock = chakra(FaLock);
const Mail = chakra(FaMailBulk);
const User = chakra(FaUser);

export interface Props {
  onUsernameChange: (username: string) => void;
  onPasswordChange: (password: string) => void;
  onEmailChange: (email: string) => void;
  onSubmit: (username: string, email: string, password: string) => void;
}

const Register: React.FC<Props> = (props: Props) => {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const toast = useToast();

    //const navigate = useNavigate();

    const handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();

        props.onSubmit(username, email, password);

        axios.post("http://localhost:3001/register", {
            username: username,
            email: email,
            password: password 
        }).then((response) => {
            const resp = response.data;
            console.log(JSON.stringify(resp));
            if (response.data != undefined) {
                //navigate("/login");
                toast({
                    title: 'Success!',
                    description: "Account created successfully!",
                    status: 'success',
                    duration: 9000,
                    isClosable: true,
                    position: "top-right"
                })
            }
        }, (error) => {
            console.log(error);
        });
        

    }

    return (
        <div>
            <Flex width="full" height="100vh" align="center" justifyContent="center" backgroundColor="#023E8A">
                <Box width="25%" p={20} borderWidth={2} borderRadius={8} boxShadow="lg" backgroundColor="whiteAlpha.800">
                    <Box textAlign="center" marginBottom="2rem">
                        <Heading>Sign up</Heading>
                    </Box>
                    <form onSubmit={handleSubmit} data-testid="register-form">
                        <FormControl id="username" isRequired mb={4}>
                            <FormLabel>Username</FormLabel>
                            <InputGroup>
                                    <InputLeftElement
                                        pointerEvents="none"
                                        children={<User color="gray.300" />}
                                    />
                                    <Input data-testid="username" outlineColor="blackAlpha.800" type="text" onChange={e => {setUsername(e.currentTarget.value); props.onUsernameChange(e.currentTarget.value)}} />
                            </InputGroup>
                        </FormControl>
                        <FormControl id="email" isRequired mb={4}>
                            <FormLabel>Email address</FormLabel>
                            <InputGroup>
                                <InputLeftElement
                                    pointerEvents="none"
                                    children={<Mail color="gray.300" />}
                                />
                                <Input data-testid="email" outlineColor="blackAlpha.800" type="email" onChange={e => {setEmail(e.currentTarget.value); props.onEmailChange(e.currentTarget.value)}} />
                            </InputGroup>
                        </FormControl>
                        <FormControl id="password" isRequired mb={8}>
                            <FormLabel>Password</FormLabel>
                            <InputGroup>
                                <InputLeftElement
                                    pointerEvents="none"
                                    children={<Lock color="gray.300" />}
                                />
                                <Input data-testid="password" outlineColor="blackAlpha.800" type="password" onChange={e => {setPassword(e.currentTarget.value); props.onPasswordChange(e.currentTarget.value)}} />
                            </InputGroup>
                        </FormControl>
                        <Divider borderColor="#023E8A" />
                        <Stack align="center">
                            <Button data-testid="submit" width="80%" mt={8} type="submit" bgColor="#0096C7">
                                Register
                            </Button>
                        </Stack>
                    </form>
                    <Box mt={6} textAlign="center">
                        Already have an account?
                        <br />
                        <Link href="/login" color="#0096C7">
                            Sign in
                        </Link>
                    </Box>
                </Box>
            </Flex>
        </div>
    )
}

export default Register;