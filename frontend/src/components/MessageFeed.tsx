import React from 'react';
import { Flex, Text, Box } from "@chakra-ui/react";
import ScrollableFeed from 'react-scrollable-feed';
import Message from './Message';

interface MessageFeedProps {
    messages: string[]
}


const MessageFeed: React.FC<MessageFeedProps> = () => {

    const messages = ['esimene item', 'teine item', 'kolmas item', 'neljas item'];

    return (
        <Flex>
            <ScrollableFeed>
                <Box padding={4}>
                    {messages?.map((message: string, i) => <Message key={i} message={message}></Message>)}
                </Box>
            </ScrollableFeed>
        </Flex>
    )
}

export default MessageFeed;