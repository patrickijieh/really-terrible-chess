import { WebSocketClient } from "./types";
import "./styles.css";
import { useEffect, useState } from "react";

const Game = () => {
    const [wsClient, setWsClient] = useState(new WebSocketClient());
    useEffect(() => { startWebSocketClient() }, []);

    const startWebSocketClient = () => {
        const name = localStorage.getItem("name");
        const gameId = localStorage.getItem("gameId");

        if (!name || !gameId) {
            return;
        }

        const newClient = new WebSocketClient(gameId, name, "/ws", false);
        newClient.activate();
        setWsClient(newClient);
    }

    const getSessionIdString = () => {
        const gameId = localStorage.getItem("gameId");
        if (!gameId) {
            return "NULL";
        }

        return gameId;
    }

    document.title = "Online Chess Game";
    return (
        <div className="content">
            <h1>Online Chess Game</h1>
            <h3>Session ID: {getSessionIdString()}</h3>
            <div id="chesstable"></div>
        </div>
    );
};

export default Game;
