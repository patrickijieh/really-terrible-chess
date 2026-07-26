import '../styles.css';
import Header from '../component/Header.tsx';

const Profile = () => {
    document.title = "Really Terrible Chess - {blank}'s Profile";
    return (
        <>
            <Header home={false}/>
            <div className="content">
                <h1>blank's Profile</h1>
            </div>
        </>
    );
};

export default Profile;
