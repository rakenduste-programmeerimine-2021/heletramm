import React from 'react';
import {Navigate} from 'react-router-dom';
import Login from '../pages/Login';


function PrivateRoute({ children, isLoggedIn } : {children: any, isLoggedIn: boolean}) {
    console.log(isLoggedIn);
    return isLoggedIn ? children : <Login />;
}

export default PrivateRoute;