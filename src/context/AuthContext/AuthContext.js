import { createContext, useContext, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuthReducer } from './AuthReducer';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const navigate = useNavigate();

    const { authData, handleLogin, handleFollowUnFollow, handleBookmark } = useAuthReducer();

    const { authToken } = authData;

    const apiHeader = { headers: { authorization: authToken } }

    return <AuthContext.Provider value={{ navigate, authData, handleLogin, handleFollowUnFollow, apiHeader, handleBookmark }} >
        {children}
    </AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext);