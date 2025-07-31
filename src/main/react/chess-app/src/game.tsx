import { Client, Stomp } from "@stomp/stompjs";
import "./styles.css";
import { useEffect, useState } from "react";

const Game = () => {
    const [stompClient, setStompClient] = useState(new Client());
    useEffect(() => { startStompClient() }, []);

    const startStompClient = () => {
        const name = localStorage.getItem("name");
        const gameId = localStorage.getItem("gameId");

        if (!name || !gameId) {
            return;
        }

        const newClient = Stomp.client("/ws");
        setStompClient(Stomp.client("/ws"));

        newClient.onConnect = on_connection;
        newClient.onWebSocketError = on_ws_error;
        newClient.debug = () => { };
        newClient.activate();

        setStompClient(newClient);
    }

    const on_connection = () => {
        console.log("client connected");
    }

    const on_ws_error = (_event: Error) => {
        console.error("websocket error");
    }
    document.title = "Online Chess Game";
    return (
        <div className="content">
            <h1>Online Chess Game</h1>
            <p>Create a new room</p>
        </div>
    );
};

export default Game;
