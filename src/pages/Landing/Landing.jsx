import axios from "axios";

import { InputField } from "../../components/InputField/InputField";
import { Logo } from "../../components/Logo/Logo";
import rightArrow from '../../assets/right-arrow.svg';
import { useAuth } from '../../';
import { useState } from "react";

export const Landing = () => {

    const { navigate, authData: { loggedInUserData, authToken }, handleLogin } = useAuth();
    const [ userName, setUsername ] = useState('');
    const [ password, setPassword ] = useState('');

    const handleGuestLogin = async(e) => {
        e.preventDefault();
        try{
            const guestLoginCall = await axios.post('/api/auth/login', { username: 'admin', password: 'admin' });
            handleLogin(guestLoginCall.data.foundUser, guestLoginCall.data.encodedToken);
            navigate('/home')
        }
        catch{
            alert('some Error occured');
        }
    }

    const doLogin = async(e) => {       
        e.preventDefault();
        if(userName.trim().length!==0 && password.trim().length!==0){
            const loginCall = await axios.post('/api/auth/login', { username: userName, password: password });
            console.log(loginCall)
            handleLogin(loginCall.data.foundUser, loginCall.data.encodedToken);
            navigate('/home');
        }
    }

    return <main className="landing-main" >
        <section className="flex-center" >
            <div className="landing-logo" > 
                <Logo/>
                <div> The end to end solution of your FOMO is here </div>
                {/* <button onClick={ () => navigate('/home') } > Explore </button> */}
            </div>
        </section>
        <section className="flex-center" >
            <div className="login-container" > 
                <div className="login-title" > LogIn </div>
                <form>
                <div className="input-field" > 
        <label> Email Address <input type='text' placeholder='abc@email.com' required/> </label>
         </div><div className="input-field" > 
        <label> Password <input type='password' placeholder='********' required /> </label>
         </div>
                    
                    <button className="btn-primary" onClick={ e =>  doLogin(e) } > LogIn </button>
                    <button className="btn-secondary" onClick={ e => handleGuestLogin(e) } > LogIn as Guest </button>
                    <button className="btn-create-new-account flex-center" onClick={ () => navigate('/signup') }       > Create New Account <img src={rightArrow} alt='create new account' />  </button>
                </form>
            </div>
        </section>
         </main>
}