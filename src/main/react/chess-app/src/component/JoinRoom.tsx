import { useNavigate } from "react-router";
import type { GameInfo } from "../types";
import "../styles.css";

const JoinRoom = () => {
    document.title = "Really Terrible Chess - Join Room";
    const navigate = useNavigate();

    const sendRoomJoinInfo = async (): Promise<void> => {
        const name_input = document.getElementById("name") as HTMLInputElement;
        const gameId_input = document.getElementById("gameId") as HTMLInputElement;
        const name: string = name_input.value;
        const gameId: string = gameId_input.value;

        if (!name || !gameId) {
            return;
        }

        const response = await fetch("/join-room", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "name": name,
                "gameId": gameId
            })
        });

        const data: GameInfo = await response.json();
        localStorage.setItem("gameId", data.gameId);
        localStorage.setItem("name", name);

        navigate("/game");
    }

    return (
        <div className="content">
            <h1>Online Chess - Join Room</h1>
            <p>Join a Room</p>
            <input type="text" name="name" id="name" placeholder="Enter your name" />
            <input type="text" name="gameId" id="gameId" placeholder="Enter the game ID" />
            <button
                className="common-button"
                onClick={sendRoomJoinInfo}>
                Join Room!
            </button>
        </div>
    );

};

export default JoinRoom;
