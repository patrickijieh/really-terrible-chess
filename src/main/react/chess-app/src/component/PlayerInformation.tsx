import playerIcon from "../img/profile-icon.png";
import "../styles.css";

const PlayerInformation = (props: { playerName: string, isYou: boolean }) => {

    return (
        <div className={`player-info ${props.isYou ? "player-client" : "player-opponent"}`}>
            <h1>{props.playerName}</h1>
            <img src={playerIcon} alt="Profile image" width={150} height={150} className="pfp" />
        </div>
    );
}

export default PlayerInformation;
