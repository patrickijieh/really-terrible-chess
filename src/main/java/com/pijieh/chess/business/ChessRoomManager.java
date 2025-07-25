package com.pijieh.chess.business;

import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;

import com.pijieh.chess.database.ChessDatabase;
import com.pijieh.chess.database.ChessDatabase.SessionCode;

public final class ChessRoomManager {

    @Autowired
    ChessDatabase database;

    public ChessRoomManager() {
    }

    public Optional<String> createRoom(String owner) {
        final String gameId = Long.toHexString(UUID.randomUUID().getMostSignificantBits());

        if (database.createSession(gameId, owner) == SessionCode.SESSION_CREATED) {
            return Optional.of(gameId);
        }
        return Optional.empty();
    }

    public Optional<String> joinRoom(String gameId, String player) {
        if (database.joinSession(gameId) == SessionCode.SESSION_FOUND) {
            return Optional.of(gameId);
        }

        return Optional.empty();
    }
}
