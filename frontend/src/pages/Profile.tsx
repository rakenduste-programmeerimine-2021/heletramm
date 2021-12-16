import React, { useEffect, useContext, useState, useCallback } from "react";
import { Flex, Box, Center, Avatar, Heading, Text, Spacer, HStack } from "@chakra-ui/react";
import axios from "axios";
import { Context } from "../store/Index";

export interface User {
    id: string,
    username: string,
    email: string,
    password: string,
}

const Profile: React.FC = () => {

    const [state] = useContext(Context);
    const [loggedUser, setLoggedUser] = useState<User>();

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

    }, [])

    return (
        <div>
            <Flex width="full" height="100vh" alignItems="center" justifyContent="center" backgroundColor="#0077B6">
                    <Box w="60%" h="90%" bg="#0096C7" ml={8} borderRadius={8} borderColor="#023E8A" borderWidth={4}>
                        <Center>
                            <Avatar mt={8} mb={4} size="2xl" name="Test13" src="" />
                        </Center>
                        <Center mb={20}>
                            <Heading>
                                {loggedUser?.username} 
                            </Heading>
                            <Heading> #{loggedUser?.id}</Heading>
                        </Center>
                        <Flex width="full" height="auto">
                            <Box p={12} mx="auto" h="20%" w="80%" backgroundColor="blue.600" borderColor="black" borderRadius={4} borderWith={4} alignContent="center">
                                <HStack p={4} borderColor="blue.800" borderWidth={3} borderRadius={8} mb={4}>
                                    <Text fontSize="4xl">User ID</Text>
                                    <Spacer />
                                    <Text color="white" fontSize="4xl">{loggedUser?.id}</Text>
                                </HStack>
                                <HStack p={4} borderColor="blue.800" borderWidth={3} borderRadius={8} mb={4}>
                                    <Text fontSize="4xl">Username</Text>
                                    <Spacer />
                                    <Text color="white" fontSize="4xl">{loggedUser?.username}</Text>
                                </HStack>
                                <HStack p={4} borderColor="blue.800" borderWidth={3} borderRadius={8} mb={4}>
                                    <Text fontSize="4xl">E-mail</Text>
                                    <Spacer />
                                    <Text color="white" fontSize="4xl">{loggedUser?.email}</Text>
                                </HStack>
                                <HStack p={4} borderColor="blue.800" borderWidth={3} borderRadius={8} mb={4}>
                                    <Text fontSize="4xl">Password</Text>
                                    <Spacer />
                                    <Text color="white" fontSize="4xl">************</Text>
                                </HStack>
                            </Box>
                        </Flex>
                    </Box>
            </Flex>
        </div>
    )

}

export default Profile;