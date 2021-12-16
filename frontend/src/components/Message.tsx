import React from 'react';
import { Flex, Tag, Text } from "@chakra-ui/react"

interface MessageProps {
  message: string
}

const Message: React.FC<MessageProps> = ({message}) => {

    return (
        <Flex my={2} p={2}>
          <Flex flexDirection="column" width="100%">
            <Flex bg="gray.200" pr={4} py={2} pl={4} borderRadius={12} boxShadow="0 2px 2px #0f0f0f0f" ml="auto" mr="auto">
              <Text fontSize={15} maxWidth={400}>
                {message}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      );

}

export default Message;