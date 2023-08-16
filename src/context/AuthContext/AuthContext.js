import { createContext, useContext, useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { useAuthReducer } from './AuthReducer';

const AuthContext = createContext();

const handleSorting = (data, action) => {
    switch(action.type){
        case 'latest' : return({ ...data, sortByLatest: true, sortByTrending: false });
        case 'trending' : return({ ...data, sortByLatest: false, sortByTrending: true });

        default: throw Error(`some error in handleing ${action.type}`);
    }
}

export const AuthProvider = ({ children }) => {

    const navigate = useNavigate();

    const { authData, handleLogin, handleFollowUnFollow, handleBookmark, updateAllPost, setsuggestedUsers, updateProfile, updateUserImage, updateLogout } = useAuthReducer();

    const { authToken, loggedInUserData, isLoggedIn } = authData;

    const apiHeader = { headers: { authorization: authToken } };

    const [ { sortByLatest, sortByTrending }, setSorting ] = useReducer(handleSorting, { sortByLatest: true, sortByTrending: false });

    const handleLatest = () => {
        setSorting({ type: 'latest' });
    }
    
    const handleTrending = () => {
        setSorting({ type: 'trending' });
    }

    const calculateMonth = number => {
        switch(number){
            case '0' : return 'January';
            case '1' : return 'February';
            case '2' : return 'March';
            case '3' : return 'April';
            case '4' : return 'May';
            case '5' : return 'June';
            case '6' : return 'July';
            case '7' : return 'August';
            case '8' : return 'September';
            case '9' : return 'October';
            case '10' : return 'November';
            case '11' : return 'December';
            default : return 'Null';
        }
    }
    
    const calculateDate = utcDate => {
        const date = new Date(utcDate.trim()).getUTCDate();
        const month = calculateMonth(new Date(utcDate.trim()).getUTCMonth().toString());
        const year = new Date(utcDate.trim()).getUTCFullYear();
        
        return `${month} ${date}, ${year}`;
    }
    
    
    const checkIfLiked = (likes) => {
        const likedByUsers = likes.likedBy.map( ({username}) => username );
        if(likedByUsers.includes(loggedInUserData.username)){
            return true;
        }
        else{
            return false;
        }
    }
    
    const handlePostLike = async(id, likes) => {
        if(checkIfLiked(likes)) {
            const dislikeCall = await axios.post(`/api/posts/dislike/${id}`, {}, apiHeader);
            updateAllPost(dislikeCall.data.posts);
        }
        else{
            const likeCall = await axios.post(`/api/posts/like/${id}`, {}, apiHeader);
            updateAllPost(likeCall.data.posts);
        }
    }
    
    const checkIfBookmarked = (id) => loggedInUserData.bookmarks.find( postId => postId ===id ) ? true : false;
    
    const handleBookmarkCall = async(id) => {
        if(checkIfBookmarked(id)){
            const removeBookmarkCall = await axios.post(`/api/users/remove-bookmark/${id}`, {}, apiHeader);
            console.log(removeBookmarkCall);
            handleBookmark(removeBookmarkCall.data.bookmarks);
            
        }
        else{
            const bookmarkCall = await axios.post(`/api/users/bookmark/${id}`, {}, apiHeader);
            console.log(bookmarkCall);
            handleBookmark(bookmarkCall.data.bookmarks);
        }
    }
    
    const deletePost = async (id) => {
        const deleteCall  = await axios.delete(`/api/posts/${id}`, apiHeader);
        updateAllPost(deleteCall.data.posts);
    }

    const fetchUsers = async() => {
        const userCall = await axios.get('/api/users');
        setsuggestedUsers(userCall.data.users.filter( ({username}) => username!==loggedInUserData?.username ));
    }

    const fetchPost = async () => {
        const postCall = await axios.get('/api/posts');
        updateAllPost(postCall.data.posts);
    }

    useEffect( () => {
        fetchPost();
        fetchUsers();
    }, [isLoggedIn] );

    return <AuthContext.Provider value={{ navigate, authData, handleLogin, handleFollowUnFollow, apiHeader, handleBookmark, updateAllPost, sortByLatest, sortByTrending, handleLatest, handleTrending, deletePost, handleBookmarkCall, checkIfBookmarked, handlePostLike, checkIfLiked, calculateDate, sortByLatest, sortByTrending, setsuggestedUsers, updateProfile, updateUserImage, updateLogout }} >
        {children}
    </AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext);