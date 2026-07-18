package com.pijieh.rtc.business.messaging;

import org.springframework.http.HttpStatus;

import com.pijieh.rtc.business.models.ChessGame.GameState;

import java.util.Objects;

public record MoveMessage (String gameId, HttpStatus status, GameState gameState, String board, boolean isWhitesTurn) {
    public MoveMessage {
        Objects.requireNonNull(gameId);
        Objects.requireNonNull(status);
        Objects.requireNonNull(gameState);
        Objects.requireNonNull(board);
    }
}
