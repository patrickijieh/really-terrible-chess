import { NavLink } from 'react-router';
import '../styles.css';


type NavProps = {
    to: string,
    displayName: string
}

const Header = () => {
    return (
        <header className='header'>
            <div className='header-padding'></div>
            <div className='header-body'>
                <div className='header-subsection header-title'>
                    <h2>really terrible chess</h2>
                </div>
                <NavButton to='/' displayName='home' />
                <a className="header-subsection" href="/rules.txt" target='_blank'>
                    <div className="header-button">
                        <h3>ruleset</h3>
                    </div>
                </a>
                <NavButton to='/login' displayName='login' />
                <NavButton to='/signup' displayName='sign up' />
            </div>
            <div className='header-padding'></div>
        </header>
    );
};


const NavButton = ({ to, displayName }: NavProps) => {
    return (
        <>
            <div className='header-subsection'>
                <NavLink to={to} className="header-button">
                    <h3>
                        {displayName}
                    </h3>
                </NavLink>
            </div>
        </>
    )
}

export default Header;
