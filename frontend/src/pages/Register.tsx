import React, {useState} from 'react';
import axios from 'axios';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import {Flex, Box, Heading, Button, Stack, Link, Divider, chakra} from '@chakra-ui/react';
import { FaLock, FaMailBulk, FaUser } from 'react-icons/fa';
import { BsPerson } from "react-icons/bs";
import { Input, InputGroup, InputLeftElement } from '@chakra-ui/input';

const Person = chakra(BsPerson);
const Lock = chakra(FaLock);
const Mail = chakra(FaMailBulk);
const User = chakra(FaUser);

const Register: React.FC = () => {

    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = () => {

        const user = {
            username: username,
            firstname: firstName,
            lastname: lastName,
            email: email,
            password: password
        }

        axios.post("http://localhost:3001/register", {
            user: user
        }).then((response) => {
            const resp = response.data;
            console.log(JSON.stringify(resp));
        }, (error) => {
            console.log(error);
        });
        

    }

    
    

    return (
        <div>
            <Flex width="full" height="100vh" align="center" justifyContent="center" backgroundColor="#45B69C">
                <Box width="25%" p={20} borderWidth={2} borderRadius={8} boxShadow="lg" backgroundColor="whiteAlpha.800">
                    <Box textAlign="center" marginBottom="2rem">
                        <Heading>Sign up</Heading>
                    </Box>
                    <form onSubmit={handleSubmit}>
                        <FormControl id="username" isRequired mb={4}>
                            <FormLabel>Username</FormLabel>
                            <InputGroup>
                                    <InputLeftElement
                                        pointerEvents="none"
                                        children={<User color="gray.300" />}
                                    />
                                    <Input outlineColor="blackAlpha.800" type="text" onChange={e => {setUsername(e.target.value)}} />
                            </InputGroup>
                        </FormControl>
                        <FormControl id="firstname" isRequired mb={4}>
                            <FormLabel>First name</FormLabel>
                            <InputGroup>
                                    <InputLeftElement
                                        pointerEvents="none"
                                        children={<Person color="gray.300" />}
                                    />
                                    <Input outlineColor="blackAlpha.800" type="text" onChange={e => {setFirstName(e.target.value)}} />
                            </InputGroup>
                        </FormControl>
                        <FormControl id="lastname" isRequired mb={4}>
                            <FormLabel>Last name</FormLabel>
                            <InputGroup>
                                <InputLeftElement
                                    pointerEvents="none"
                                    children={<Person color="gray.300" />}
                                />
                                <Input outlineColor="blackAlpha.800" type="email" onChange={e => {setLastName(e.target.value)}} />
                            </InputGroup>
                        </FormControl>
                        <FormControl id="email" isRequired mb={4}>
                            <FormLabel>Email address</FormLabel>
                            <InputGroup>
                                <InputLeftElement
                                    pointerEvents="none"
                                    children={<Mail color="gray.300" />}
                                />
                                <Input outlineColor="blackAlpha.800" type="email" onChange={e => {setEmail(e.target.value)}} />
                            </InputGroup>
                        </FormControl>
                        <FormControl id="password" isRequired mb={8}>
                            <FormLabel>Password</FormLabel>
                            <InputGroup>
                                <InputLeftElement
                                    pointerEvents="none"
                                    children={<Lock color="gray.300" />}
                                />
                                <Input outlineColor="blackAlpha.800" type="password" onChange={e => {setPassword(e.target.value)}} />
                            </InputGroup>
                        </FormControl>
                        <Divider />
                        <Stack align="center">
                            <Button width="80%" mt={8} type="submit" bgColor="#45B69C">
                                Register
                            </Button>
                        </Stack>
                    </form>
                    <Box mt={6} textAlign="center">
                        Already have an account?
                        <br />
                        <Link href="/login" color="#21D19F">
                            Sign in
                        </Link>
                    </Box>
                </Box>
            </Flex>
        </div>
    )
}

export default Register;