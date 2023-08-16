import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext/AuthContext";
import axios from "axios";

import whiteHeart from '../../assets/whiteHeart.svg';
import redHeart from '../../assets/redHeart.svg';
import bookmark from '../../assets/bookmark.svg';
import bookmarked from '../../assets/bookmarked.svg';
import share from '../../assets/share.svg';
import { usePostAndProfile } from "../../context/PostAndProfile/PostAndProfile";

export const Explore = () => {

    const { authData: { isLoggedIn, loggedInUserData, followingList, allPost }, handleFollowUnFollow, apiHeader, handleBookmark, navigate, deletePost, handleBookmarkCall, checkIfBookmarked, handlePostLike, checkIfLiked, calculateDate, sortByLatest, sortByTrending  } = useAuth();
    const { setPost } = usePostAndProfile();

    const postToShow = [...allPost].toSorted( (a,b) => {
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

  return <>
  {
            postToShow?.map( ({ content, profileName, createdAt, username, _id, likes, profileUrl }) => <div className="post-container-box" >
                <div className="post-user-data" >
                    <img src={profileUrl} alt={profileName.split()[0]} className="post-user-img" />
                    <div className="post-username" > {profileName} @{username} </div>
                </div>
                    <div> { calculateDate(createdAt) } </div>
                 {content} <br/>
                 <div> 
            <> <img src={ isLoggedIn ? (checkIfLiked(likes) ? redHeart : whiteHeart ) : whiteHeart} alt='like dislike' onClick={ () => handlePostLike(_id, likes) } /> <span> {likes.likeCount} </span> </>
            <img src={ isLoggedIn ? (checkIfBookmarked(_id) ? bookmarked : bookmark ) : bookmark} alt='bookmark' onClick={ () => handleBookmarkCall(_id) } />
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
  </>
}