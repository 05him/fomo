import logo from '../../assets/pink skull.svg'


export const Logo = ({ className }) => {

    // const { navigate } = useAuth()

    // const navigateToHome = () => navigate('/')

   return <div className={`logo ${className}`}> 
    <img src={logo} alt='dark store logo' />
    <p> FOMO </p>
    </div>
}