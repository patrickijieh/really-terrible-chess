import { useNavigate } from "react-router";
import type { GameInfo } from "../types";
import "../styles.css";

const CreateRoom = () => {
    document.title = "Online Chess - Create Room";
    const navigate = useNavigate();

    const sendRoomCreationInfo = async (): Promise<void> => {
        const input = document.getElementById("name") as HTMLInputElement;
        const name: string = input.value;

        if (!name) {
            return;
        }

        const response = await fetch("/create-room", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "name": name
            })
        });

        const data: GameInfo = await response.json();
        localStorage.setItem("gameId", data.gameId);
        localStorage.setItem("name", name);

        navigate("/game");
    }

    return (
        <div className="content">
            <h1>Online Chess - Create Room</h1>
            <p>Create a new room</p>
            <input type="text" name="name" id="name" placeholder="Enter your name" />
            <button
                className="common-button"
                onClick={sendRoomCreationInfo}>
                Create Room!
            </button>
        </div>
    );
};

export default CreateRoom;
