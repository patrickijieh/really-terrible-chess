import playerIcon from "../img/profile-icon.png";
import "../styles.css";

const PlayerInformation = (props: { playerName: string, alignRight: boolean, isCurrentTurn: boolean }) => {
    return (
        <div className={`player-info ${props.alignRight ? "portrait-right" : "portrait-left"}`}>
            <div style={{ width: "fit-content" }}>
                <div>
                    <h1>{props.playerName}</h1>
                    <img src={playerIcon} alt="Profile image" width={150} height={150} className="pfp" />
                </div>
                <div className={`${props.isCurrentTurn ? "" : "hidden-indicator"} turn-indicator`}>
                </div>
            </div>
        </div>
    );
}

export default PlayerInformation;
