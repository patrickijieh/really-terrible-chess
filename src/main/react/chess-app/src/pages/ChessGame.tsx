import { WebSocketClient } from "../WebSocketClient.ts";
import { useEffect, useState } from "react";
import ChessBoard from "../component/chess/Chessboard.tsx";
import PlayerInformation from "../component/PlayerInformation.tsx";
import chess1mp3 from "../audio/chess1.mp3";
import chess2mp3 from "../audio/chess2.mp3";
import chess3mp3 from "../audio/chess3.mp3";
import "../styles.css";
import GameOverModal from "../component/GameOverModal.tsx";

const ChessGame = () => {
    document.title = "Really Terrible Chess";


    const [wsClient, setWsClient] = useState<WebSocketClient>(new WebSocketClient());
    const [boardStr, setBoardStr] = useState("");
    const [isPlayerWhite, setPlayerWhite] = useState(true);
    const [isWhitesTurn, setWhitesTurn] = useState(true);
    const [gameData, setGameData] = useState({
        player: "You",
        opponent: "Opponent",
        state: "NORMAL"
    });
    const movementSounds = [
        new Audio(chess1mp3), new Audio(chess2mp3), new Audio(chess3mp3)
    ];

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

    const updateGameState = (board: string, opp: string, username: string, isWhite?: boolean, whitesTurn?: boolean, gameState?: string) => {
        let newData = {
            ...gameData
        };

        newData.opponent = opp;
        newData.player = username;

        if (isWhite != null) {
            setPlayerWhite(isWhite);
        }

        if (whitesTurn != null) {
            setWhitesTurn(whitesTurn);
        }

        if (gameState != null) {
            newData.state = gameState;
        }

        setGameData({
            ...newData
        });
        setBoardStr(board);

        playRandomMoveSound();
    }

    const playRandomMoveSound = () => {
        let rand = Math.floor(Math.random() * movementSounds.length);

        movementSounds[rand].play();
    };

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

    if (gameData.state === "FINISHED") {
        if (isWhitesTurn !== isPlayerWhite) {
            console.log("you won \\o/");
        } else {
            console.log("you lost D:");
        }
    }

    let gameIdString = getGameIdString();

    return (
        <>
            <GameHeader gameId={gameIdString} />
            <div className="content">
                <GameOverModal show={gameData.state === "FINISHED"} isWinner={isWhitesTurn !== isPlayerWhite} opponentName={gameData.opponent} />
                {boardStr ?
                    <>
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
                    </> :
                    <InvitePlayers gameId={gameIdString} />
                }
            </div>
        </>
    );
};

const InvitePlayers = (props: { gameId: string }) => {
    return <div className="chesstable">
        <div>
            <p>{`it's time to duel!`}</p>
        </div>
        <div>
            <p>{`invite another player by sending them this code: ${props.gameId}!`}</p>
        </div>
    </div>;
}

const GameHeader = (props: { gameId: string }) => {
    return (
        <header className='game-header'>
            <div className='header-padding'></div>
            <div className='header-body'>
                <div className='header-subsection header-title'>
                    <p>really terrible chess</p>
                </div>
                <a className="header-subsection" href="/">
                    <div className="header-button">
                        <p>Home</p>
                    </div>
                </a>
                <div className="header-subsection header-title">
                    <p>game id: {props.gameId}</p>
                </div>
            </div>
            <div className='header-padding'></div>
        </header>
    );
};

export default ChessGame;
