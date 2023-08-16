import axios from "axios";
import { useAuth } from "../../context/AuthContext/AuthContext";

export const SuggestedUsers = () => {

    const { authData: { isLoggedIn, loggedInUserData, followingList, suggestedUsers }, handleFollowUnFollow, apiHeader, handleBookmark, navigate, postToShow, updatePostToShow, deletePost, handleBookmarkCall, checkIfBookmarked, handlePostLike, checkIfLiked, calculateDate, sortByLatest, sortByTrending, handleLatest, handleTrending  } = useAuth();

    const checkFollowedOrNot = (id) => loggedInUserData.following.find( ({_id}) => _id ===id ) ? true : false;

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

    

    return       <> 
    <div className="sortby-container" > Sort BY <button className={ sortByLatest ? 'sort-btn-active' : 'sort-btn-inactive' } onClick={ handleLatest } > Latest </button> <button className={ sortByTrending ? 'sort-btn-active' : 'sort-btn-inactive' } onClick={ handleTrending } > Trending </button> </div>
    <div className="suggested-user-container" > Suggested users to follow 
    <ul>
    {
        suggestedUsers?.map(({ firstName, lastName, _id, profileUrl }) => <li> <img src={profileUrl} alt={firstName.split()[[0]]} className="suggested-user-avatar" /> {firstName} {lastName} <button onClick={ () => handleUserFollow(_id) } > { checkFollowedOrNot(_id) ? 'Un-Follow' : 'Follow' } </button> </li>)
    }
    </ul>
    </div>
    </>
}
