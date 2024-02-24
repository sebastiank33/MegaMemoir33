import React, { createContext, useReducer, useEffect } from 'react';
import axios from 'axios';

export const AuthorizationContext = createContext();

const initialState = JSON.parse(localStorage.getItem('user')) || null;

const reducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return action.payload;
        case 'LOGOUT':
            return null;
        default:
            return state;
    }
};

export const AuthorizationProvider = ({ children }) => {
    const [user, dispatch] = useReducer(reducer, initialState);

    const login = async (inputs) => {
        const res = await axios.post('/auth/login', inputs);
        dispatch({ type: 'LOGIN', payload: res.data });
    };

    const logout = async () => {
        await axios.post('/auth/logout');
        dispatch({ type: 'LOGOUT' });
    };

    useEffect(() => {
        localStorage.setItem('user', JSON.stringify(user));
    }, [user]);

    return (
        <AuthorizationContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthorizationContext.Provider>
    );
};