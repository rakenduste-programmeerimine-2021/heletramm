import React from "react";
import { useState } from 'react';
import { Flex, Box, Heading, Spacer, ListItem} from "@chakra-ui/layout";
import {List, Input, WrapItem, Avatar, AvatarBadge, Text, Divider} from "@chakra-ui/react";
import MessageBox from "../components/Message";
import MessageFeed from "../components/MessageFeed";

const Home: React.FC = () => {

    // Teha if statement, kas on logged in v ei, selle jargi muuta avatarbadge varvi

    const testMessages = ["message1", "messag23"];
    const [message, setMessage] = useState("");



    return (
        <div>
            <Flex width="full" height="100vh" alignItems="center" justifyContent="center">
                    <Box w="20%" h="80%" bg="red" ml={8} borderRadius={8}>
                        <Heading ml={24}>Contacts</Heading>
                        <List spacing={6} mt={4} ml={4}>
                            <ListItem>
                                <Avatar name="Jaanus Mikker" src="https://via.placeholder.com/150" size="lg">
                                    <AvatarBadge boxSize="0.8em" bg="green" borderColor="transparent"/>
                                </Avatar>
                                <Text>Test Kasutaja</Text>
                            </ListItem>
                            <ListItem>
                                <Avatar name="Jaanus Mikker" src="https://via.placeholder.com/150" size="lg">
                                    <AvatarBadge boxSize="0.8em" bg="tomato" borderColor="transparent" />
                                </Avatar>
                                <Text>Another test</Text>
                            </ListItem>
                        </List>
                    </Box>
                    <Spacer />
                    <Box w="70%" h="80%" bg="green" mr={8} borderRadius={8}>
                        <Heading ml={8} mt={4}>Username</Heading>
                        <Divider mt={6} />
                        <MessageFeed messages={testMessages} />
                        <Input ml={10} mt={48} width="80%" placeholder="Message...." bg="white" size="lg" onKeyPress={(event) => setMessage(event.currentTarget.value)}/>
                    </Box>
            </Flex>
        </div>
    )
}

export default Home;