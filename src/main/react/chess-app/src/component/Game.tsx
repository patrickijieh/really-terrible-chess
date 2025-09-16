import { WebSocketClient } from "../WebSocketClient";
import "../styles.css";
import { useEffect, useState } from "react";
import ChessBoard from "./Chessboard";

const Game = () => {
    const [_wsClient, setWsClient] = useState<WebSocketClient>(new WebSocketClient());
    const [boardStr, _setBoardStr] = useState<string>("");
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

    document.title = "Really Terrible Chess";
    return (
        <div className="content">
            <h1>Really Terrible Chess Game</h1>
            <h3>Session ID: {getSessionIdString()}</h3>
            <div
                id="chesstable"
                onDragStartCapture={() => { }}
                onDragEndCapture={() => { }}
            >
                <ChessBoard board={boardStr} />
            </div>
        </div>
    );
};

export default Game;
