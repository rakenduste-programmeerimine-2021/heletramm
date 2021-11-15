import React from 'react';
import { FormControl, FormLabel, FormHelperText } from '@chakra-ui/form-control';
import {Flex, Box, Heading, Button, Divider} from '@chakra-ui/react';
import { Input } from '@chakra-ui/input';

const Register: React.FC = () => {


    return (
        <div>
            <Flex width="100%" align="center" justifyContent="center" marginTop="12rem">
                <Box p={20} borderWidth={1} borderRadius={8} boxShadow="lg">
                    <Box alignContent="center" marginBottom="2rem">
                        <Heading>Register</Heading>
                    </Box>
                    <form>
                        <FormControl id="firstname">
                            <FormLabel>First name</FormLabel>
                            <Input type="text" />
                        </FormControl>
                        <FormControl id="lastname">
                            <FormLabel>Last name</FormLabel>
                            <Input type="text" />
                        </FormControl>
                        <FormControl id="email">
                            <FormLabel>Email address</FormLabel>
                            <Input type="email" />
                        </FormControl>
                        <FormControl id="password">
                            <FormLabel>Password</FormLabel>
                            <Input type="password" />
                        </FormControl>
                        <Button width="full" mt={14} type="submit">
                            Register
                        </Button>
                    </form>
                </Box>
            </Flex>
        </div>
    )
}

export default Register;