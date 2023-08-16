import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext/AuthContext";
import axios, { all } from "axios";

import whiteHeart from '../../assets/whiteHeart.svg';
import redHeart from '../../assets/redHeart.svg';
import bookmark from '../../assets/bookmark.svg';
import bookmarked from '../../assets/bookmarked.svg';
import share from '../../assets/share.svg';
import { usePostAndProfile } from "../../context/PostAndProfile/PostAndProfile";

export const LoggedInUserPage = () => {

    const { authData: { isLoggedIn, loggedInUserData, followingList, allPost}, handleFollowUnFollow, apiHeader, handleBookmark, navigate, deletePost, handleBookmarkCall, checkIfBookmarked, handlePostLike, checkIfLiked, calculateDate, sortByLatest, sortByTrending  } = useAuth();

    const { setPost } = usePostAndProfile();


    // const [postToShow, updatePostToShow] = useState([])

    // const fetchPosts = async() => {
    //     const postCall = await axios.get('/api/posts')
    //     updatePostToShow(postCall.data.posts.filter( ({username}) => username===loggedInUserData.username || followingList.includes(username) )
    //     .toSorted( (a,b) => {
    //         if(sortByLatest){
    //             const date1 = new Date(a.createdAt.trim());
    //             const date2 = new Date(b.createdAt.trim());
    //             if( date2 > date1 ) return 1;
    //             else return -1;
    //         }
    //         else if(sortByTrending){
    //             return b.likes.likeCount - a.likes.likeCount;
    //         }
    //          } )
    //          );
    // }

    // useEffect(  () => {
    //     if(isLoggedIn){
    //         fetchPosts();
    //     }
    // }, [] )

    const postToShow = allPost?.filter( ({username}) => username===loggedInUserData.username || followingList.includes(username) )
        .toSorted( (a,b) => {
            if(sortByLatest){
                const date1 = new Date(a.createdAt.trim());
                const date2 = new Date(b.createdAt.trim());
                if( date2 > date1 ) return 1;
                else return -1;
            }
            else if(sortByTrending){
                return b.likes.likeCount - a.likes.likeCount;
            }
             } );

    console.log(postToShow);
    return <>
    {
        postToShow?.map( ({ content, profileName, createdAt, username, _id, likes, profileUrl }) => <div className="post-container-box" >
            <div className="post-user-data" >
                <img src={profileUrl} alt={profileName?.split('')[0]} className="post-user-img" />
                <div className="post-username" > {profileName} @{username} </div>
            </div>
                <div> { calculateDate(createdAt) } </div>
             {content} <br/>
             <div> 
        <> <img src={ checkIfLiked(likes) ? redHeart : whiteHeart } alt='like dislike' onClick={ () => handlePostLike(_id, likes) } /> <span> {likes.likeCount} </span> </>
        <img src={ checkIfBookmarked(_id) ? bookmarked : bookmark } alt='bookmark' onClick={ () => handleBookmarkCall(_id) } />
        <img src={share} alt='share' /> 
        <br/>
        {
            username === loggedInUserData?.username && <>
        <button onClick={ () => setPost({ type: 'showModal', text: content, edit: true, postId: _id }) } > Edit </button>
        <button onClick={ () => deletePost(_id) } > Delete </button>
        </>
        }
        </div>
          </div> )
    }
     {
        postToShow?.length===0 && <div> Follow someone or create a post </div>
    }
    </>
}