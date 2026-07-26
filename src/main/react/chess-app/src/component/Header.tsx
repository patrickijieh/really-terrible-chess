import { NavLink } from 'react-router';
import '../styles.css';


type RouterProps = {
    to: string,
    displayName: string
}

type NavProps = {
    to: string,
    displayName: string
    targetBlank?: boolean
}

const Header = (props: {home: boolean}) => {
    return (
        <header className='header'>
            <div className='header-padding'></div>
            <div className='header-body'>
                <div className='header-subsection header-title'>
                    <h2>really terrible chess</h2>
                </div>
                {props.home ?
                    <>
                        <RouterButton to='/' displayName='home' />
                        <NavButton to="/rules.txt" displayName="ruleset" targetBlank={true}/>
                        <NavButton to='/login' displayName='login' />
                        <NavButton to='/signup' displayName='sign up' />
                    </>
                    :
                    <>
                        <NavButton to='/' displayName='home' />
                        <NavButton to="/rules.txt" displayName="ruleset" targetBlank={true}/>
                        <RouterButton to='/login' displayName='login' />
                        <RouterButton to='/signup' displayName='sign up' />
                    </>
                }

            </div>
            <div className='header-padding'></div>
        </header>
    );
};


const RouterButton = ({ to, displayName }: RouterProps) => {
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

const NavButton = ({to, displayName, targetBlank}: NavProps) => {
    return (
        <>
            <a className="header-subsection" href={to} target={targetBlank ? "_blank" : "_self"}>
                <div className="header-button">
                    <h3>
                        {displayName}
                    </h3>
                </div>
            </a>
        </>
    )
}

export default Header;
