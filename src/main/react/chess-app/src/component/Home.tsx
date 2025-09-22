import { NavLink } from 'react-router';

import '../styles.css';
import Header from './Header';

const Home = () => {
    document.title = "Really Terrible Chess - Home";

    return (
        <>
            <Header />
            <div className="content">
                <h1>Welcome to Really Terrible Chess!</h1>
                <section className='home-actions'>
                    <section className='game-navigation'>
                        <div>
                            <h3>Create A Room</h3>
                        </div>
                        <NavLink to="/create-room" className="common-button">Create Room</NavLink>
                    </section>
                    <section className='game-navigation'>
                        <div>
                            <h3>Join A Room</h3>
                        </div>
                        <NavLink to="/join-room" className="common-button">Join Room</NavLink>
                    </section>
                </section>
            </div>
        </>
    );
};

export default Home;
