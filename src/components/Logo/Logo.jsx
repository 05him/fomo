import logo from '../../assets/pink skull.svg';
import { useAuth } from '../../context/AuthContext/AuthContext';


export const Logo = ({ className }) => {

    const { navigate } = useAuth()

    // const navigateToHome = () => navigate('/')

   return <div className={`logo ${className}`}  onClick={ () => {navigate('/')} } > 
    <img src={logo} alt='dark store logo' />
    <p> FOMO </p>
    </div>
}