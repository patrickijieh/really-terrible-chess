import "../styles.css";
import { useState, type ChangeEvent } from "react";

const JoinRoom = () => {
    document.title = "Really Terrible Chess - Join Room";

    const [state, setState] = useState({
        name: "",
        gameId: ""
    });

    const sendRoomJoinRequest = async (): Promise<void> => {

        if (state.name.length < 1 || state.gameId.length < 1) {
            return;
        }

        const response = await fetch("/join-room", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "name": state.name,
                "gameId": state.gameId
            })
        });

        const data: { gameId: string } = await response.json();
        localStorage.setItem("gameId", data.gameId);
        localStorage.setItem("name", state.name);

        window.location.href = "./game";
    }

    const handleFormChange = (event: ChangeEvent<HTMLInputElement>) => {
        setState({
            ...state,
            [event.target.id]: event.target.value
        });
    }

    return (
        <div className="content">
            <h1>Really Terrible Chess - Join Room</h1>
            <h3>Join Another Room</h3>
            <section className="form">
                <div className="form-body">
                    <div className="form-item">
                        <h4 className="form-label">
                            Your username
                        </h4>
                        <input type="text" name="name" id="name" className="form-input"
                            value={state.name}
                            onKeyUp={(event) => {
                                if (event.key === "Enter") { sendRoomJoinRequest() }
                            }}
                            onChange={(event) =>
                                handleFormChange(event)}
                            placeholder="Enter your name" />
                    </div>
                    <div className="form-item">
                        <h4 className="form-label">
                            Game ID
                        </h4>
                        <input type="text" name="gameId" id="gameId" className="form-input"
                            value={state.gameId}
                            onKeyUp={(event) => {
                                if (event.key === "Enter") { sendRoomJoinRequest() }
                            }}
                            onChange={(event) =>
                                handleFormChange(event)}
                            placeholder="Enter the game ID" />
                    </div>
                    <button
                        className="common-button btn"
                        onClick={(_e) => sendRoomJoinRequest()}>
                        Join Room!
                    </button>
                </div>
            </section>
        </div>
    );
};

export default JoinRoom;
