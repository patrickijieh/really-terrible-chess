import { WebSocketClient } from "../../WebSocketClient";
import { useEffect, useState } from "react";
import ChessBoard from "./Chessboard";
import PlayerInformation from "../PlayerInformation";
import "../../styles.css";

const ChessGame = () => {
    document.title = "Really Terrible Chess";

    const [wsClient, setWsClient] = useState<WebSocketClient>(new WebSocketClient());
    const [boardStr, setBoardStr] = useState("");
    const [gameData, setGameData] = useState({
        player: "You",
        opponent: "Opponent"
    });

    useEffect(() => {
        let username = localStorage.getItem("username");
        if (username !== null) {
            setGameData({
                ...gameData,
                player: username
            })
        }
        startWebSocketClient();
    }, []);

    const updateGameState = (board: string, opp: string, username: string) => {
        setGameData({
            player: username,
            opponent: opp
        })

        setBoardStr(board);
    }

    const startWebSocketClient = () => {
        const username = localStorage.getItem("username");
        const gameId = localStorage.getItem("gameId");

        if (!username || !gameId) {
            return;
        }

        const newClient = new WebSocketClient(gameId, username, "/ws", updateGameState, false);
        newClient.activate();
        setWsClient(newClient);
    }

    const sendMove = (move: string) => {
        wsClient.sendMove(move);
    }

    return (
        <div className="content">
            <SessionID />
            <PlayerInformation playerName={gameData.opponent}
                isYou={false}
            />
            <div id="chesstable" className="chesstable">
                <ChessBoard board={boardStr} sendMove={sendMove} />
            </div>
            <PlayerInformation playerName={gameData.player}
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
