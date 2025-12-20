import { WebSocketClient } from "../../WebSocketClient";
import { useEffect, useState } from "react";
import ChessBoard from "./Chessboard";
import PlayerInformation from "../PlayerInformation";
import "../../styles.css";

const ChessGame = () => {
    document.title = "Really Terrible Chess";

    const [wsClient, setWsClient] = useState<WebSocketClient>(new WebSocketClient());
    const [boardStr, setBoardStr] = useState("");
    const [isPlayerWhite, setPlayerWhite] = useState(true);
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

    const updateGameState = (board: string, opp: string, username: string, isWhite?: boolean) => {
        if (isWhite !== undefined) {
            setGameData({
                ...gameData,
                player: username,
                opponent: opp
            });
            setPlayerWhite(isWhite);
        } else {
            setGameData({
                ...gameData,
                player: username,
                opponent: opp
            });
        }

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


    const playerTitle = `${gameData.player} (You)`;
    return (
        <div className="content">
            <SessionID />
            <PlayerInformation playerName={gameData.opponent ? gameData.opponent : "Opponent"}
                bottom={false}
            />
            <div id="chesstable" className="chesstable">
                <ChessBoard board={boardStr} sendMove={sendMove} isPlayerWhite={isPlayerWhite} />
            </div>
            <PlayerInformation playerName={playerTitle}
                bottom={true}
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
