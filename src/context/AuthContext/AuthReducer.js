import { useReducer } from 'react';

const handleAuth = (data, action) => {
    switch(action.type){
        case 'login': return({ ...data, loggedInUserData: action.userData, authToken: action.token, isLoggedIn: true, followingList: action.userData.following.map( ({username}) => username ) });
        case 'follow-unfollow': return({ ...data, loggedInUserData: action.userData, followingList: action.userData.following.map( ({username}) => username ) });
        case 'bookmark': return({ ...data, loggedInUserData: { ...data.loggedInUserData, bookmarks: action.newList } });

        default: throw Error(`some error in handelig ${action.type}`)
    }
}

export const useAuthReducer = () => {
    const [ authData, setAuthData ] = useReducer(handleAuth, { isLoggedIn: false, followingList: [] });

    const handleLogin = (userData, token) => setAuthData({ type: 'login', userData: userData, token: token });
    const handleFollowUnFollow = (userData) => setAuthData({ type: 'follow-unfollow', userData: userData }) ;
    const handleBookmark = newList => setAuthData({ type: 'bookmark', newList: newList });

    return { authData, handleLogin, handleFollowUnFollow, handleBookmark };
}