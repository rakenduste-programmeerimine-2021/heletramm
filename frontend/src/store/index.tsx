import React from 'react';
import { createContext, useReducer, useEffect } from 'react';
import { authReducer } from './reducer';
import combineReducers from "react-combine-reducers";
import axios from 'axios';

interface storeProps {
    children: any
}

const initialAuth = {
    token: null,
    user: null,
    id: null,
    email: null
}

const [combinedReducer, initialState] = combineReducers({
    auth: [authReducer, initialAuth]
})

export const Context = createContext(initialState);


function Store ({ children }: storeProps) {

    const [state, dispatch] = useReducer(combinedReducer, initialState);


    return (
        <Context.Provider value={[ state, dispatch ]}>
            {children}
        </Context.Provider>
    )

}

export default Store;