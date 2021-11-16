import React from 'react';
import { FormControl, FormLabel, FormHelperText} from '@chakra-ui/form-control';
import {Flex, Box, Heading, Button} from "@chakra-ui/react";
import { Input } from '@chakra-ui/input';

const Login = () => {
    return (
        <div>
            <Flex width="full" align="center" justifyContent="center" marginTop="12rem">
                <Box p={20} borderWidth={2} borderRadius={8} boxShadow="lg">
                    <Box textAlign="center">
                        <Heading>Login</Heading>
                    </Box>
                    <Box my={4} textAlign="left">
                        <form>
                            <FormControl id="email" isRequired>
                                <FormLabel>Email address</FormLabel>
                                <Input type="email" />
                                <FormHelperText>We'll never share your email</FormHelperText>
                            </FormControl>
                            <FormControl id="password" isRequired>
                                <FormLabel>Password</FormLabel>
                                <Input type="password" />
                                <FormHelperText>Don't ever share your password with anyone</FormHelperText>
                            </FormControl>
                            <Button width="full" mt={4} type="submit">
                                Sign In
                            </Button>
                        </form>
                    </Box>
                </Box>
            </Flex>
        </div>
    )
}

export default Login;