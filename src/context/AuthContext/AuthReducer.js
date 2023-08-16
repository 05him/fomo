import { useReducer } from 'react';

const handleAuth = (data, action) => {
    switch(action.type){
        case 'login': return({ ...data, loggedInUserData: action.userData, authToken: action.token, isLoggedIn: true, followingList: action.userData.following.map( ({username}) => username ) });
        case 'follow-unfollow': return({ ...data, loggedInUserData: action.userData, followingList: action.userData.following.map( ({username}) => username ) });
        case 'bookmark': return({ ...data, loggedInUserData: { ...data.loggedInUserData, bookmarks: action.newList } });
        case 'suggestedUser' : return({ ...data, suggestedUsers: action.list })
        case 'allPost': return({ ...data, allPost: action.posts });
        case 'profileData' : return({ ...data, loggedInUserData: { ...data.loggedInUserData, ...action.newData } });
        case 'img' : return({ ...data, loggedInUserData: { ...data.loggedInUserData, profileUrl: action.newUrl }, allPost: data.allPost?.map( post => post.username===data.loggedInUserData.username ? ({ ...post, profileUrl: action.newUrl}) : post ) });
        case 'logout' : return({ ...data, isLoggedIn: false });

        default: throw Error(`some error in handelig ${action.type}`)
    }
}

export const useAuthReducer = () => {
    const [ authData, setAuthData ] = useReducer(handleAuth, { isLoggedIn: false, followingList: [], postToShow: [],  });

    const handleLogin = (userData, token) => setAuthData({ type: 'login', userData: userData, token: token });
    const handleFollowUnFollow = (userData) => setAuthData({ type: 'follow-unfollow', userData: userData }) ;
    const handleBookmark = newList => setAuthData({ type: 'bookmark', newList: newList });
    const updateAllPost = posts => setAuthData({ type: 'allPost', posts: posts });
    const setsuggestedUsers = list => setAuthData({ type: 'suggestedUser', list: list });
    const updateProfile = data => setAuthData({ type: 'profileData', newData: data })
    const updateUserImage = img => setAuthData({ type: 'img', newUrl: img });
    const updateLogout = () => setAuthData({ type: 'logout' })

    return { authData, handleLogin, handleFollowUnFollow, handleBookmark, updateAllPost, setsuggestedUsers, updateProfile, updateUserImage, updateLogout };
}