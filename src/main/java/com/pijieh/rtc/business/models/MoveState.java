package com.pijieh.rtc.business.models;

import com.pijieh.rtc.business.models.ChessGame.GameState;

import java.util.Objects;

public record MoveState(boolean isValidMove, GameState gameState, BoardPosition ghostPiecePosition) {
    public MoveState {
        Objects.requireNonNull(gameState);
        Objects.requireNonNull(ghostPiecePosition);
    }
}
