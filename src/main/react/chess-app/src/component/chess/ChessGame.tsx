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
    const [isWhitesTurn, setWhitesTurn] = useState(true);
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

    const updateGameState = (board: string, opp: string, username: string, isWhite?: boolean, isWhitesTurn?: boolean) => {
        if (isWhite != null) {
            setPlayerWhite(isWhite);
        }

        if (isWhitesTurn != null) {
            setWhitesTurn(isWhitesTurn);
        }

        setGameData({
            ...gameData,
            player: username,
            opponent: opp
        });

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

    const getGameIdString = () => {
        const gameId = localStorage.getItem("gameId");
        if (!gameId) {
            return "";
        }

        return gameId;
    }

    const playerTitle = `${gameData.player} (You)`;
    return (
        <>
            <GameHeader gameId={getGameIdString()} />
            <div className="content">
                <PlayerInformation playerName={gameData.opponent ? gameData.opponent : "Opponent"}
                    alignRight={false}
                    isCurrentTurn={!(isWhitesTurn == isPlayerWhite)}
                />
                <div id="chesstable" className="chesstable">
                    <ChessBoard board={boardStr} sendMove={sendMove} isPlayerWhite={isPlayerWhite} isWhitesTurn={isWhitesTurn} />
                </div>
                <PlayerInformation playerName={playerTitle}
                    alignRight={true}
                    isCurrentTurn={isWhitesTurn == isPlayerWhite}
                />
            </div>
        </>
    );
};

const GameHeader = (props: { gameId: string }) => {
    return (
        <header className='header'>
            <div className='header-padding'></div>
            <div className='header-body'>
                <div className='header-subsection header-title'>
                    <h1>really terrible chess</h1>
                </div>
                <a className="header-subsection" href="/">
                    <div className="header-button">
                        <h2>Home</h2>
                    </div>
                </a>
                <div className="header-subsection header-title">
                    <h1>game id: {props.gameId}</h1>
                </div>
            </div>
            <div className='header-padding'></div>
        </header>
    );
};

export default ChessGame;
