import playerIcon from "../img/profile-icon.png";
import "../styles.css";

const PlayerInformation = (props: { playerName: string, alignRight: boolean, isCurrentTurn: boolean }) => {
    return (
        <div className={`player-info ${props.alignRight ? "portrait-right" : "portrait-left"}`}>
            <div style={{ width: "fit-content" }}>
                <div>
                    <p>{props.playerName}</p>
                    <img src={playerIcon} alt="Profile image" width={50} height={50} className="pfp" />
                </div>
                <div className={`${props.isCurrentTurn ? "" : "hidden-indicator"} turn-indicator`}>
                </div>
            </div>
        </div>
    );
}

export default PlayerInformation;
