package com.pijieh.chess.business;

import java.util.concurrent.ConcurrentHashMap;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;

import com.pijieh.chess.business.models.ChessGame;
import com.pijieh.chess.business.models.Player;
import com.pijieh.chess.database.ChessDatabase;
import com.pijieh.chess.database.ChessDatabase.SessionCode;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public final class ChessRoomManager {

    @Autowired
    ChessDatabase database;

    int maxGames;
    ConcurrentHashMap<String, ChessGame> chessGames;

    public ChessRoomManager(int maxNumberOfChessGames) {
        ConcurrentHashMap<String, ChessGame> games = new ConcurrentHashMap<>(maxGames);
        this.chessGames = games;
        this.maxGames = maxNumberOfChessGames;
    }

    public Optional<String> createRoom(String owner) {
        final String gameId = Long.toHexString(UUID.randomUUID().getMostSignificantBits());

        if (database.createSession(gameId, owner) != SessionCode.SESSION_CREATED) {
            return Optional.empty();
        }

        ChessGame newGame = new ChessGame(owner);
        chessGames.put(gameId, newGame);
        log.info("Created new session with gameId: {}", gameId);
        return Optional.of(gameId);
    }

    public Optional<String> joinRoom(String gameId, String player) {
        if (database.joinSession(gameId) != SessionCode.SESSION_FOUND) {
            return Optional.empty();
        }

        ChessGame game = chessGames.get(gameId);
        game.setPlayerTwo(new Player(player));
        log.info("Started new session with gameId: {}", gameId);
        return Optional.of(gameId);
    }

    public boolean playerIsInRoom(String gameId, String playerName) {
        ChessGame game = chessGames.get(gameId);

        if (null == game) {
            return false;
        }

        if (null == game.getPlayerTwo()) {
            return game.getPlayerOne().getName().equals(playerName);
        }

        return game.getPlayerOne().getName().equals(playerName) ||
                game.getPlayerTwo().getName().equals(playerName);
    }

    private void destroyRoom(String gameId) {
        if (database.deleteSession(gameId) != SessionCode.SESSION_DELETED) {
            return;
        }

        chessGames.remove(gameId);
    }
}
