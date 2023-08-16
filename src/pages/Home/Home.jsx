import { useEffect, useState, useReducer } from "react";
import axios from "axios";
import { NavLink, Route, Routes } from 'react-router-dom';

import { Logo } from '../../components/Logo/Logo';
import { useAuth, usePostAndProfile } from '../../';
import whiteHeart from '../../assets/whiteHeart.svg';
import redHeart from '../../assets/redHeart.svg';
import bookmark from '../../assets/bookmark.svg';
import bookmarked from '../../assets/bookmarked.svg';
import share from '../../assets/share.svg';
import { SuggestedUsers } from "../../components/SuggestedUsers/SugestedUsers";
import { LoggedInUserPage } from "../LoggedInUserPage/LoggedInUserPage";
import { NewToFomo } from "../../components/NewToFomo/NewToFomo";
import { Explore } from "../Explore/Explore";
import { BookMarks } from "../Bookmarks/Bookmarks";

export const Home = () => { 

    const { authData: { isLoggedIn, loggedInUserData, followingList}, handleFollowUnFollow, apiHeader, handleBookmark, navigate, deletePost, handleBookmarkCall, checkIfBookmarked, handlePostLike, checkIfLiked, calculateDate, sortByLatest, sortByTrending, updateLogout  } = useAuth();
    const { CreatePost, unHidePostModal, Profile, setProfile } = usePostAndProfile();
    // console.log(loggedInUserData);

    console.log(Profile);

//    console.log(isLoggedIn);

    const doLogout = ()=> {
        updateLogout();
        navigate('/')
    }

    return <>
    <main className="home-main">
        <aside className="left-side-nav">
        <Logo className={'nav-logo'} />
            <ul>
                <NavLink to='/home'> <li> Home </li> </NavLink>
                <NavLink to='/home/explore' > <li> Explore </li> </NavLink>
                <NavLink to='/home/bookmarks' > <li> BookMarks </li> </NavLink>
                <li onClick={ unHidePostModal } > Create A Post </li>
                <li onClick={ () => setProfile({ type: 'modalView' }) } > Profile </li> 
                <li onClick={ doLogout } > Logout </li>
            </ul>
        </aside>
        <section className="home-main-section">
        <CreatePost />
        <Profile />
            <Routes>
                <Route path='/' element={ <LoggedInUserPage /> } />
                <Route path='/home/explore' element={ <Explore /> } />
                <Route path='/home/bookmarks' element={ <BookMarks /> } />
            </Routes>

        </section>

        <aside className="right-side-nav">
           { isLoggedIn ? <SuggestedUsers /> : <NewToFomo /> } 
        </aside>

    </main>
    </>
}