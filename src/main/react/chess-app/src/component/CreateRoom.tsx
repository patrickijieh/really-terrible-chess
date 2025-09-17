import { useNavigate } from "react-router";
import type { GameInfo } from "../types";
import "../styles.css";
import { useState, type ChangeEvent } from "react";

const CreateRoom = () => {
    document.title = "Really Terrible Chess - Create Room";

    const [name, setName] = useState("");

    const navigate = useNavigate();

    const sendRoomCreationRequest = async (): Promise<void> => {
        if (name.length < 1) {
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

    const handleFormChange = (event: ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    }

    return (
        <div className="content">
            <h1>Really Terrible Chess - Create Room</h1>
            <p>Create a new room</p>
            <input type="text" name="name" id="name"
                value={name}
                onChange={(event) =>
                    handleFormChange(event)}
                placeholder="Enter your name" />
            <button
                className="common-button"
                onClick={(_e) => sendRoomCreationRequest()}>
                Create Room!
            </button>
        </div>
    );
};

export default CreateRoom;
