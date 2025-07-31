import { NavLink } from 'react-router';

import './styles.css';

const Home = () => {
    document.title = "Online Chess - Home";
    return (
        <div className="content">
            <h1>Welcome to Online Chess!</h1>
            <p>Start building amazing things with Rsbuild.</p>
            <NavLink to="/create-room" className="common-button">Create Room</NavLink>
            <NavLink to="/join-room" className="common-button">Join Room</NavLink>
        </div>
    );
};

export default Home;
