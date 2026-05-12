import "../styles.css";
import Header from "./Header";
import ErrorMessage from "./ErrorMessage";
import { useState, type ChangeEvent } from "react";

const CreateRoom = () => {
    document.title = "Really Terrible Chess - Create Room";

    const [username, setUsername] = useState("");
    const [errorMsgs, setErrorMsgs] = useState({
        username: "",
        form: ""
    });
    const sendRoomCreationRequest = async (): Promise<void> => {
        if (username.length < 3 || username.length > 15) {
            setErrorMsgs({
                ...errorMsgs,
                username: "username must be between 3 and 15 characters long."
            });
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

        let data: { gameId: string };
        try {
            data = await response.json();
        } catch (err) {
            setErrorMsgs({
                ...errorMsgs,
                form: "server error, please try again later."
            });
            return;
        }

        localStorage.setItem("gameId", data.gameId);
        localStorage.setItem("username", username);

        window.location.href = "./game";
    }

    const handleFormChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
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
                <h1>Really Terrible Chess - Create Room</h1>
                <h3>Creating a new Room</h3>
                <section className="form">
                    <div className="form-body">
                        <div className="form-group">
                            <h4 className="form-label">
                                Your username
                            </h4>
                            <div className="form-item">
                                <input type="text" name="username" id="username" className="form-input"
                                    value={username}
                                    onKeyUp={(event) => {
                                        if (event.key === "Enter") { sendRoomCreationRequest() }
                                    }}
                                    onChange={(event) =>
                                        handleFormChange(event)}
                                    placeholder="Username" />
                            </div>
                        </div>
                        <ErrorMessage message={errorMsgs.username} />
                        <button
                            className="common-button btn"
                            onClick={(_e) => sendRoomCreationRequest()}>
                            Create Room
                        </button>
                        <ErrorMessage message={errorMsgs.form} />
                    </div>
                </section>
            </div>
        </>
    );
};

export default CreateRoom;
