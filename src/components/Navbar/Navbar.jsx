import { Logo } from "../Logo/Logo"

export const Navbar = () => {
    return <nav> 
        <div className="nav-container" > 
            <Logo className={'nav-logo'} />
            <input type='text' placeholder='search post/ person here' />
        </div>
    </nav>
}