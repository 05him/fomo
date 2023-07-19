import { useEffect, useState, useReducer } from "react";
import axios from "axios";

import { Navbar } from "../../components/Navbar/Navbar"
import { useAuth } from '../../';
import whiteHeart from '../../assets/whiteHeart.svg';
import redHeart from '../../assets/redHeart.svg';
import bookmark from '../../assets/bookmark.svg';
import bookmarked from '../../assets/bookmarked.svg';
import share from '../../assets/share.svg';

const handleSorting = (data, action) => {
    switch(action.type){
        case 'latest' : return({ ...data, sortByLatest: true, sortByTrending: false });
        case 'trending' : return({ ...data, sortByLatest: false, sortByTrending: true });

        default: throw Error(`some error in handleing ${action.type}`);
    }
}

const handlePost = (data, action) => {
    switch(action.type){
        case 'showModal' : return({ ...data, showPostModal: true, newPostText: action.text ?? '', isEdit: action.edit ?? false, postId: action.postId });
        case 'hideModal' : return({ ...data, showPostModal: false, newPostText: '', isEdit: false, postId: '' });
        case 'textChange' : return({ ...data, newPostText: action.value });
        
        default: throw Error(`some eoor in handeling ${action.type}`)
    }
}

export const Explore = () => { 

    const { authData: { isLoggedIn, loggedInUserData, followingList }, handleFollowUnFollow, apiHeader, handleBookmark, navigate } = useAuth();

    const [ suggestedUsers, setsuggestedUsers ] = useState([]);
    const [ postToShow, setPostToSHow ] = useState([]);
    const [ { sortByLatest, sortByTrending }, setSorting ] = useReducer(handleSorting, { sortByLatest: true, sortByTrending: false });
    const [ { newPostText, showPostModal, isEdit, postId }, setPost ] = useReducer(handlePost, { newPostText: '', showPostModal: false, isEdit: false, postId : '' });

    const fetchUsers = async() => {
        const userCall = await axios.get('/api/users');
        setsuggestedUsers(userCall.data.users.filter( ({username}) => username!==loggedInUserData.username ));
    }

    const handleUserFollow = async (id) => {
        if(checkFollowedOrNot(id)) {
            const unFollowCall = await axios.post(`/api/users/unfollow/${id}`, {}, apiHeader );
            handleFollowUnFollow(unFollowCall.data.user);
        }
        else{
            const followCall = await axios.post(`/api/users/follow/${id}`, {}, apiHeader)
            handleFollowUnFollow(followCall.data.user)
        }
    }

    const checkFollowedOrNot = (id) => loggedInUserData.following.find( ({_id}) => _id ===id ) ? true : false;

    const fetchPosts = async() => {
        const postCall = await axios.get('/api/posts')
        setPostToSHow(postCall.data.posts.toSorted( (a,b) => {
            if(sortByLatest){
                const date1 = new Date(a.createdAt.trim());
                const date2 = new Date(b.createdAt.trim());
                if( date2 > date1 ) return 1;
                else return -1;
            }
            else if(sortByTrending){
                return b.likes.likeCount - a.likes.likeCount;
            }
             } ));
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
        }
        else{
            const likeCall = await axios.post(`/api/posts/like/${id}`, {}, apiHeader);
        }
        fetchPosts();
    }

    const checkIfBookmarked = (id) => loggedInUserData.bookmarks.find( ({_id}) => _id ===id ) ? true : false;

    const handleBookmarkCall = async(id) => {
        if(checkIfBookmarked(id)){
            const removeBookmarkCall = await axios.post(`/api/users/remove-bookmark/${id}`, {}, apiHeader);
            handleBookmark(removeBookmarkCall.data.bookmarks);
            
        }
        else{
            const bookmarkCall = await axios.post(`/api/users/bookmark/${id}`, {}, apiHeader);
            handleBookmark(bookmarkCall.data.bookmarks);
        }
        
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

    const handleLatest = () => {
        setSorting({ type: 'latest' });
        fetchPosts();
    }

    const handleTrending = () => {
        setSorting({ type: 'trending' });
         fetchPosts();
    }

    const addPost = async() => {
        if(isEdit){
            const editCall = await axios.post(`/api/posts/edit/${postId}`, { postData: newPostText }, apiHeader);
        }
        else {
            const postcall = await axios.post('/api/posts', { postData: newPostText }, apiHeader);
        }
        fetchPosts();
        setPost({ type: 'hideModal' });
    }

    const deletePost = async (id) => {
        const deleteCall  = await axios.delete(`/api/posts/${id}`, {}, apiHeader);
        fetchPosts();
    }

    useEffect(  () => {
        if(isLoggedIn){
            fetchUsers();
            fetchPosts();
        }
    }, [followingList] )


    const CreatePost = () => {
        return <div className="post-modal-container" style={{ display: showPostModal ? 'block' : 'none' }} > 
        <div className="post-modal" >
            <div> Create a New Post </div>
            <input type='text' placeholder="type here" value={newPostText} onChange={ e => setPost({ type: 'textChange', value: e.target.value }) } />
            <button onClick={ addPost } > { isEdit ? 'Make Changes' : 'Add New Post' }  </button>
            <button onClick={ () => setPost({ type: 'hideModal' }) } > Cancel </button>
        </div>
        </div>
    }

    return <>
    <Navbar />
    <main className="home-main">
        <aside className="left-side-nav">
            <ul>
            <li onClick={ () => navigate('/home') } > Home </li>
                <li onClick={ () => navigate('/explore') } > Explore </li>
                <li onClick={ () => navigate('/bookmarks') } > BookMarks </li>
                <li onClick={ () => setPost({ type: 'showModal' }) }  > Create A Post </li>
            </ul>
        </aside>
        <section className="home-main-section">
    <CreatePost />

            {
                postToShow?.map( ({ content, profileName, createdAt, username, _id, likes, profileUrl }) => <div className="post-container-box" >
                    <div className="post-user-data" >
                        <img src={profileUrl} alt='img' className="post-user-img" />
                        <div> {profileName} @{username}  </div>
                    </div>
                        <div> { calculateDate(createdAt) } </div>
                     {content} <br/>
                     <div> 
                <> 
                <img src={ checkIfLiked(likes) ? redHeart : whiteHeart } alt='like dislike' onClick={ () => handlePostLike(_id, likes) } /> <span> {likes.likeCount} </span> </>
                <img src={ checkIfBookmarked(_id) ? bookmarked : bookmark } alt='bookmark' onClick={ () => handleBookmarkCall(_id) } />
                <img src={share} alt='share' /> 
                <br/>
                {
                    username === loggedInUserData.username && <>
                <button onClick={ () => setPost({ type: 'showModal', text: content, edit: true, postId: _id }) } > Edit </button>
                <button onClick={ () => deletePost(_id) } > Delete </button>
                </>
                }
                </div>
                  </div> )
            }
        </section>
        <aside className="right-side-nav">
            {
                !isLoggedIn &&
            <>
            New to FOMO <br />
            <button> LogIn </button> <br/>
            <button> SignUp </button>
            <div>
                Sort By <select>
                    <option> Trending </option>
                    <option> Latest </option>
                </select>
            </div>
            </>
            }
            {
                isLoggedIn && <> 
                <div className="sortby-container" > Sort BY <button className={ sortByLatest ? 'sort-btn-active' : 'sort-btn-inactive'  } onClick={ handleLatest } > Latest </button> <button className={ sortByTrending ? 'sort-btn-active' : 'sort-btn-inactive'  } onClick={ handleTrending } > Trending </button> </div>
                <div className="suggested-user-container" > Suggested users to follow
                <ul>
                {
                    suggestedUsers?.map(({ firstName, lastName, _id, profileUrl }) => <li> <img src={profileUrl} className="suggested-user-avatar" /> {firstName} {lastName} <button onClick={ () => handleUserFollow(_id) } > { checkFollowedOrNot(_id) ? 'Un-Follow' : 'Follow' } </button> </li>)
                }
                </ul>
                </div>
                </>
            }

        </aside>
    </main>
    </>
}