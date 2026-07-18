import "../styles.css";
import { useState, type ChangeEvent } from "react";
import Header from "./Header";
import ErrorMessage from "./ErrorMessage";

const JoinRoom = () => {
    document.title = "Really Terrible Chess - Join Room";

    const [state, setState] = useState({
        username: "",
        gameId: ""
    });
    const [errorMsgs, setErrorMsgs] = useState({
        username: "",
        gameId: "",
        form: ""
    });

    const sendRoomJoinRequest = async (): Promise<void> => {
        let error = false;
        let newMsgs = {
            username: "",
            gameId: "",
            form: ""
        };

        if (state.username.length < 3 || state.username.length > 15) {
            newMsgs.username = "username must be between 3 and 15 characters long.";
            error = true;
        }

        if (state.gameId.length < 12 || state.gameId.length > 16) {
            newMsgs.gameId = "game ID must be a valid ID.";
            error = true;
        }

        if (error) {
            setErrorMsgs({
                ...newMsgs
            });
            return;
        }

        const response = await fetch("/join", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "username": state.username,
                "gameId": state.gameId
            })
        });

        let data: { gameId: string };
        try {
            data = await response.json();
        } catch (err) {
            setErrorMsgs({
                ...errorMsgs,
                form: "invalid input."
            });
            return;
        }
        localStorage.setItem("gameId", data.gameId);
        localStorage.setItem("username", state.username);

        window.location.href = "./game";
    }

    const handleFormChange = (event: ChangeEvent<HTMLInputElement>) => {
        setState({
            ...state,
            [event.target.id]: event.target.value
        });
        setErrorMsgs({
            ...errorMsgs,
            [event.target.id]: "",
            form: ""
        });
    }

    return (
        <>
            <Header />
            <div className="content">
                <h1>Really Terrible Chess - Join Room</h1>
                <h3>Join Another Room</h3>
                <section className="form">
                    <div className="form-body">
                        <div className="form-group">
                            <h4 className="form-label">
                                Your username
                            </h4>
                            <div className="form-item">
                                <input type="text" name="username" id="username" className="form-input"
                                    value={state.username}
                                    onKeyUp={(event) => {
                                        if (event.key === "Enter") { sendRoomJoinRequest() }
                                    }}
                                    onChange={(event) =>
                                        handleFormChange(event)}
                                    placeholder="Enter your name" />
                            </div>
                        </div>
                        <ErrorMessage message={errorMsgs.username} />
                        <div className="form-group">
                            <h4 className="form-label">
                                Game ID
                            </h4>
                            <div className="form-item">
                                <input type="text" name="gameId" id="gameId" className="form-input"
                                    value={state.gameId}
                                    onKeyUp={(event) => {
                                        if (event.key === "Enter") { sendRoomJoinRequest() }
                                    }}
                                    onChange={(event) =>
                                        handleFormChange(event)}
                                    placeholder="Enter the game ID" />
                            </div>
                        </div>
                        <ErrorMessage message={errorMsgs.gameId} />
                        <button
                            className="common-button btn"
                            onClick={(_e) => sendRoomJoinRequest()}>
                            Join Room!
                        </button>
                        <ErrorMessage message={errorMsgs.form} />
                    </div>
                </section>
            </div>
        </>
    );
};

export default JoinRoom;
