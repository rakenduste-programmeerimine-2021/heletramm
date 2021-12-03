import React, { useEffect, useState } from 'react';
import { Flex, Text, Box } from "@chakra-ui/react";
import ScrollableFeed from 'react-scrollable-feed';
import Message from './Message';

interface MessageFeedProps {
    messages: string[]
}


const MessageFeed: React.FC<MessageFeedProps> = ({messages}) => {

    console.log(messages);

    return (
        <Flex mr={8} justifyContent="flex-end">
            <Box padding={4} justifyContent="right">
                {messages?.map((message: string, i) => <Message key={i} message={message}></Message>)}
            </Box>
        </Flex>
    )
}

export default MessageFeed;