import axios from "axios";

import { InputField } from "../../components/InputField/InputField";
import { Logo } from "../../components/Logo/Logo";
import rightArrow from '../../assets/right-arrow.svg';
import { useAuth } from "../../";
import { useState } from "react";

export const SignUp = () => {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')

    const { navigate, handleLogin } = useAuth();

    const handleSignIn = async(e) => {
        e.preventDefault();
        const signInCall = await axios.post('/api/auth/signup', { email, username, firstName, lastName, password });
        handleLogin(signInCall.data.createdUser, signInCall.data.encodedToken);
        navigate('/home');
    }

    return <main className="landing-main" >
        <section className="flex-center" >
            <div className="landing-logo" > 
                <Logo/>
                <div> The end to end solution of your FOMO is here </div>
                <button onClick={ () => navigate('/home') } > Explore </button>
            </div>
        </section>
        <section className="flex-center" >
            <div className="login-container" > 
                <div className="login-title" > SignUp </div>
                <form>
                    <div className="input-field" > <label> First Name < input type={'text'} placeholder={'name'} value={firstName} onChange={ e => setFirstName(e.target.value) } /> </label> </div>
                    <div className="input-field" > <label> Last Name < input type={'text'} placeholder={'name'} value={lastName} onChange={ e => setLastName(e.target.value) } /> </label> </div>
                    <div className="input-field" > <label> UserName< input type={'text'} placeholder={'username'} value={username} onChange={ e => setUsername(e.target.value) } /> </label> </div>
                    <div className="input-field" > <label> Email Address  < input type={'text'} placeholder={'abc@email.com'} value={email} onChange={e => setEmail(e.target.value)} /> </label> </div>
                    <div className="input-field" > <label> Password < input type={'password'} placeholder={'***********'} value={password} onChange={ e => setPassword(e.target.value)} /> </label> </div>
                    <div className="input-field" > <label> Confirm Password < input type={'password'} placeholder={'***********'} /> </label> </div>
                    <button className="btn-primary" onClick={ e => handleSignIn(e) } > Create New Account </button>
                    <button className="btn-create-new-account flex-center" onClick={ () => navigate('/') } > Already have account? <img src={rightArrow} alt='create new account' />  </button>
                </form>
            </div>
        </section>
         </main>
}