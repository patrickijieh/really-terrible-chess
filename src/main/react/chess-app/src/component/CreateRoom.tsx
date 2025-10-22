import "../styles.css";
import { useState, type ChangeEvent } from "react";

const CreateRoom = () => {
    document.title = "Really Terrible Chess - Create Room";

    const [username, setUsername] = useState("");

    const sendRoomCreationRequest = async (): Promise<void> => {
        if (username.length < 1) {
            return;
        }

        const response = await fetch("/create-room", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "username": username
            })
        });

        const data: { gameId: string } = await response.json();
        localStorage.setItem("gameId", data.gameId);
        localStorage.setItem("username", username);

        window.location.href = "./game";
    }

    const handleFormChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    }

    return (
        <div className="content">
            <h1>Really Terrible Chess - Create Room</h1>
            <h3>Creating a new Room</h3>
            <section className="form">
                <div className="form-body">
                    <div className="form-item">
                        <h4 className="form-label">
                            Your username
                        </h4>
                        <input type="text" name="username" id="username" className="form-input"
                            value={username}
                            onKeyUp={(event) => {
                                if (event.key === "Enter") { sendRoomCreationRequest() }
                            }}
                            onChange={(event) =>
                                handleFormChange(event)}
                            placeholder="Username" />
                    </div>
                    <button
                        className="common-button btn"
                        onClick={(_e) => sendRoomCreationRequest()}>
                        Create Room
                    </button>
                </div>
            </section>
        </div>
    );
};

export default CreateRoom;
