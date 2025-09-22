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
                    <h1>really terrible chess</h1>
                </div>
                <NavButton to='/' displayName='Home' />
                <NavButton to='/' displayName='Ruleset' />
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
                    <h2>
                        {displayName}
                    </h2>
                </NavLink>
            </div>
        </>
    )
}

export default Header;
