package com.pijieh.chess.business;

import java.util.concurrent.ConcurrentHashMap;
import java.util.Optional;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.pijieh.chess.business.models.ChessGame;
import com.pijieh.chess.database.ChessDatabase;
import com.pijieh.chess.database.ChessDatabase.SessionCode;

public final class ChessRoomManager {

    private static final Logger logger = LoggerFactory.getLogger(ChessRoomManager.class);

    @Autowired
    ChessDatabase database;

    int maxGames;
    ConcurrentHashMap<String, ChessGame> games;

    public ChessRoomManager(int maxNumberOfChessGames) {
        ConcurrentHashMap<String, ChessGame> games = new ConcurrentHashMap<>(maxGames);
        this.games = games;
        this.maxGames = maxNumberOfChessGames;
    }

    public Optional<String> createRoom(String owner) {
        final String gameId = Long.toHexString(UUID.randomUUID().getMostSignificantBits());

        if (database.createSession(gameId, owner) != SessionCode.SESSION_CREATED) {
            return Optional.empty();
        }

        ChessGame newGame = new ChessGame(owner);
        games.put(gameId, newGame);
        logger.info("Created new session with gameId: {}", gameId);
        return Optional.of(gameId);
    }

    public Optional<String> joinRoom(String gameId, String player) {
        if (database.joinSession(gameId) != SessionCode.SESSION_FOUND) {
            return Optional.empty();
        }

        ChessGame game = games.get(gameId);
        game.setPlayerTwo(player);
        logger.info("Started new session with gameId: {}", gameId);
        return Optional.of(gameId);
    }

    private void destroyRoom(String gameId) {
        if (database.deleteSession(gameId) != SessionCode.SESSION_DELETED) {
            return;
        }

        games.remove(gameId);
    }
}
