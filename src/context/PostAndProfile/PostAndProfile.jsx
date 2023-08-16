import { useContext, createContext, useReducer, useState } from "react";
import { useAuth } from "../AuthContext/AuthContext";
import axios from "axios";

const PostAndProfileContext = createContext();

const handlePost = (data, action) => {
    switch(action.type){
        case 'showModal' : return({ ...data, showPostModal: true, newPostText: action.text ?? '', isEdit: action.edit ?? false, postId: action.postId });
        case 'hideModal' : return({ ...data, showPostModal: false, newPostText: '', isEdit: false, postId: '' });
        case 'textChange' : return({ ...data, newPostText: action.value });
        
        default: throw Error(`some eoor in handeling ${action.type}`)
    }
}

const handleProfile = (data, action) => {
    switch(action.type){
        case 'modalView' : return ({ ...data, showProfileModal: !data.showProfileModal });

        default: throw Error(`some error occured in handeling ${action.type}`);
    }
}

export const PostAndProfileProvider = ({children}) => {

    const [ { newPostText, showPostModal, isEdit, postId }, setPost ] = useReducer(handlePost, { newPostText: '', showPostModal: false, isEdit: false, postId : '' });

    const [ { showProfileModal }, setProfile ] = useReducer(handleProfile, { showProfileModal: false });

    const { authData: { loggedInUserData }, updateAllPost, apiHeader, updateProfile, updateUserImage } = useAuth();
    
    const [ portfolio, setPortfolio ] = useState(loggedInUserData?.protfolio && '');
    const [ bio, setBio ] = useState(loggedInUserData?.bio && '');

    const hidePostModal = () => setPost({ type: 'hideModal' });
    const unHidePostModal = () => setPost({ type: 'showModal' });

    const addPost = async() => {
        if(isEdit){
            const editCall = await axios.post(`/api/posts/edit/${postId}`, { postData: newPostText }, apiHeader);
            updateAllPost(editCall.data.posts);
            hidePostModal();
        }
        else {
            const postcall = await axios.post('/api/posts', { postData: newPostText }, apiHeader);
            hidePostModal();
            updateAllPost(postcall.data.posts);
        }
        
    }
    
    const CreatePost = () => {
        return <div className="post-modal-container" style={{ display: showPostModal ? 'block' : 'none' }} > 
        <div className="post-modal" >
            <div> Create a New Post </div>
            <input type='text' placeholder="type here" value={newPostText} onChange={ e => setPost({ type: 'textChange', value: e.target.value }) } />
            <button onClick={ addPost } > { isEdit ? 'Make Changes' : 'Add New Post' }  </button>
            <button onClick={ hidePostModal } > Cancel </button>
        </div>
        </div>
    }

    const updateBio = () => {
        updateProfile({ bio });
        setProfile({ type: 'modalView' })
    }

    const updatePortfolio = () => {
        updateProfile({ portfolio });
        setProfile({ type: 'modalView' })
    }


    const handleCancel = () => {
        setBio(loggedInUserData?.bio && '');
        setPortfolio(loggedInUserData?.portfolio && '');
        setProfile({ type: 'modalView' });
    }

    const [ showImages, setShowImages ] = useState(false);

    const imgLinks = [ 
        'https://i.pravatar.cc/100?img=38',
        'https://i.pravatar.cc/100?img=37',
        'https://i.pravatar.cc/100?img=40',
        'https://i.pravatar.cc/100?img=12',
        'https://i.pravatar.cc/100?img=8',
        'https://i.pravatar.cc/100?img=4',
    ]

    const handleUpdateImage = () => {
        updateUserImage(selectedImage);
        setShowImages(false);
    }

    const [ selectedImage, setSelectedImage ] = useState('');

    const Profile = () => {
       return <div className="profile-modal-container" style={{ display: showProfileModal ? 'block' : 'none' }} > 
            <div className="profile-modal" >
                <div> {loggedInUserData?.firstName} {loggedInUserData?.lastName} <img src={loggedInUserData?.profileUrl} style={{ width: '100px' }} /> </div>

                {
                    !showImages && <button onClick={ () => setShowImages(true) } > Change Profile </button>
                }
                {
                    showImages && <>
                       <div className="images-list" >
                    {
                        imgLinks?.map( (img, index) => <img onClick={ () => setSelectedImage(img) } src={img} key={index} className={ selectedImage===img && 'selected-img' } /> )
                    }
                </div>
                <button onClick={ handleUpdateImage } > Update Image </button>
                    </>
                }
                <div className="input-field" > 
                    <label> Bio: <input type='text' value={bio} onChange={ e => setBio(e.target.value) } /> </label>
                </div> 
                <button onClick={ updateBio } > Update Bio </button>
                <div className="input-field" >
                    <label> Portfolio: <input type='text' value={portfolio} onChange={ e => setPortfolio(e.target.value) } /> </label>
                </div>
                <button onClick={ updatePortfolio } > Update portfolio </button>
                <div>

                <button onClick={ handleCancel } > Cancel </button>
                </div>
            </div>
        </div>  
    }

    return <PostAndProfileContext.Provider value={{ hidePostModal, CreatePost, unHidePostModal, setPost, Profile, setProfile }} >
        {children}
    </PostAndProfileContext.Provider>
}

export const usePostAndProfile = () => useContext(PostAndProfileContext);