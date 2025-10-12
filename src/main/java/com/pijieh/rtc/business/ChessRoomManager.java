package com.pijieh.rtc.business;

import java.util.concurrent.ConcurrentHashMap;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;

import com.pijieh.rtc.business.models.ChessGame;
import com.pijieh.rtc.business.models.Player;
import com.pijieh.rtc.business.models.ChessGame.GameState;
import com.pijieh.rtc.database.ChessDatabase;
import com.pijieh.rtc.database.ChessDatabase.SessionCode;

import lombok.extern.slf4j.Slf4j;

// TODO: Separate player map into different manager
@Slf4j
public final class ChessRoomManager {

    @Autowired
    ChessDatabase database;

    @Autowired
    ChessEngine chessEngine;

    int maxGames;
    int maxPlayers;
    ConcurrentHashMap<String, ChessGame> chessGames;
    ConcurrentHashMap<String, Player> players;

    public ChessRoomManager(int maxNumberOfChessGames) {
        this.maxGames = maxNumberOfChessGames;
        this.maxPlayers = maxNumberOfChessGames * 2;
        ConcurrentHashMap<String, ChessGame> games = new ConcurrentHashMap<>(maxGames);
        ConcurrentHashMap<String, Player> players = new ConcurrentHashMap<>(maxPlayers);
        this.chessGames = games;
        this.players = players;
    }

    public Optional<String> createRoom(String ownerName) {
        final String gameId = Long.toHexString(UUID.randomUUID().getMostSignificantBits())
                .toUpperCase();

        if (database.createSession(gameId, ownerName) != SessionCode.SESSION_CREATED) {
            return Optional.empty();
        }

        Player playerOne = new Player(ownerName);
        ChessGame newGame = new ChessGame(playerOne, gameId,
                chessEngine.getDefaultBoard());
        chessGames.put(gameId, newGame);
        log.info("Created new game with id: {}", newGame.getId());
        return Optional.of(newGame.getId());
    }

    public Optional<String> joinRoom(String gameId, String playerName) {
        if (database.joinSession(gameId) != SessionCode.SESSION_FOUND) {
            return Optional.empty();
        }

        ChessGame game = chessGames.get(gameId);
        if (game.getPlayerTwo() != null
                && !game.getPlayerTwo().getName().equals(playerName)) {

            return Optional.empty();
        }

        game.setPlayerTwo(new Player(playerName));
        return Optional.of(game.getId());
    }

    public boolean playerIsInRoom(String gameId, String playerName) {
        ChessGame game = chessGames.get(gameId);

        if (game == null) {
            return false;
        }

        if (game.getPlayerTwo() == null) {
            return game.getPlayerOne().getName().equals(playerName);
        }

        return game.getPlayerOne().getName().equals(playerName) ||
                game.getPlayerTwo().getName().equals(playerName);
    }

    public void setPlayerSession(String socketSessionId, String playerName, String gameId) throws RuntimeException {
        ChessGame game = chessGames.get(gameId);

        // Should not happen
        if (game == null) {
            throw new RuntimeException("game id is somehow not valid; resort to crashing & burning");
        }

        if (game.getPlayerOne().getName().equals(playerName)) {
            game.getPlayerOne().setSocketSessionId(socketSessionId);
            game.getPlayerOne().setGameId(game.getId());
            players.put(socketSessionId, game.getPlayerOne());
        } else {
            game.getPlayerTwo().setSocketSessionId(socketSessionId);
            game.getPlayerTwo().setGameId(game.getId());
            players.put(socketSessionId, game.getPlayerTwo());
        }

        checkIfGameIsReady(game);
    }

    public void removePlayer(String socketSessionId) {
        Player disconnectedPlayer = players.get(socketSessionId);

        if (disconnectedPlayer == null) {
            log.info("No session found with socket id {}", socketSessionId);
            return;
        }

        destroyGame(disconnectedPlayer.getGameId());
        players.remove(socketSessionId);
    }

    public Player[] getPlayersFromGame(String gameId) {
        ChessGame game = this.chessGames.get(gameId);

        if (game == null) {
            return new Player[0];
        }

        if (game.getPlayerTwo() == null) {
            return new Player[] { game.getPlayerOne() };
        }

        return new Player[] { game.getPlayerOne(), game.getPlayerTwo() };
    }

    public boolean isGameReady(String gameId) {
        ChessGame game = chessGames.get(gameId);

        return (game != null) ? game.isReady() : false;
    }

    public String startGame(String gameId) {
        ChessGame game = chessGames.get(gameId);

        if (game != null) {
            game.setGameState(GameState.NORMAL);
            log.info("Game session {} has started", game.getId());
        }

        return chessEngine.stringifyBoard(game.getChessboard());
    }

    public String getChessboardFromId(String gameId) {
        ChessGame game = chessGames.get(gameId);

        return (game != null) ? chessEngine.stringifyBoard(game.getChessboard()) : "";
    }

    private void destroyGame(String gameId) {
        if (database.deleteSession(gameId) != SessionCode.SESSION_DELETED) {
            return;
        }

        log.info("Deleting game with id: {}", gameId);
        chessGames.remove(gameId);
    }

    private void checkIfGameIsReady(ChessGame game) {
        if (game.isPlayerOneConnected() && game.isPlayerTwoConnected()) {
            game.setGameState(GameState.READY);
            log.info("game {} is ready to start", game.getId());
        }
    }
}
