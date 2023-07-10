import axios from "axios";

import { InputField } from "../../components/InputField/InputField";
import { Logo } from "../../components/Logo/Logo";
import rightArrow from '../../assets/right-arrow.svg';
import { useAuth } from "../../";

export const SignUp = () => {

    const { navigate } = useAuth();

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
                <InputField label={'Full Name'} inputType={'text'} placeholder={'name'} />
                    <InputField label={'UserName'} inputType={'text'} placeholder={'username'} />
                    <InputField label={'Email Address'}  inputType={'text'} placeholder={'abc@email.com'} />
                    <InputField label={'Password'} inputType={'password'} placeholder={'***********'} />
                    <InputField label={'Confirm Password'} inputType={'password'} placeholder={'***********'} />
                    <button className="btn-primary" > Create New Account </button>
                    <button className="btn-create-new-account flex-center" onClick={ () => navigate('/') } > Already have account? <img src={rightArrow} alt='create new account' />  </button>
                </form>
            </div>
        </section>
         </main>
}