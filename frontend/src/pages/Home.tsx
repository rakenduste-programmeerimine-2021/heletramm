import React from "react";
import { Flex, Box, Heading } from "@chakra-ui/layout";

const Home: React.FC = () => {

    return (
        <div>
            <Flex width="100%" align="center" justifyContent="center">
                <Box textAlign="center" mt={8}>
                    <Heading>See on landing page</Heading>
                </Box>
            </Flex>
        </div>
    )
}

export default Home;