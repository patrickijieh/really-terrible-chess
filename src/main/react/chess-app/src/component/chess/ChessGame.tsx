import { WebSocketClient } from "../../WebSocketClient";
import { useEffect, useState } from "react";
import ChessBoard from "./Chessboard";
import PlayerInformation from "../PlayerInformation";
import "../../styles.css";

const ChessGame = () => {
    document.title = "Really Terrible Chess";

    const [_wsClient, setWsClient] = useState<WebSocketClient>(new WebSocketClient());
    const [boardStr, _setBoardStr] = useState("");
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

    return (
        <div className="content">
            <SessionID />
            <PlayerInformation playerName={"player1"}
                isYou={false}
            />
            <div id="chesstable" className="chesstable">
                <ChessBoard board={boardStr} />
            </div>
            <PlayerInformation playerName={"player2"}
                isYou={true}
            />
        </div>
    );
};

const SessionID = () => {
    const getSessionIdString = () => {
        const gameId = localStorage.getItem("gameId");
        if (!gameId) {
            return null;
        }

        return gameId;
    }

    return (
        getSessionIdString() === null ?
            (<></>) : (<h3>Session ID: {getSessionIdString()}</h3>)
    );
}

export default ChessGame;
