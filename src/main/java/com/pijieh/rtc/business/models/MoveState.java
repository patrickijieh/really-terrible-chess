package com.pijieh.rtc.business.models;

import com.pijieh.rtc.business.models.ChessGame.GameState;
import org.springframework.lang.Nullable;

import java.util.Objects;

public record MoveState(boolean isValidMove, GameState gameState,
                        @Nullable BoardPosition ghostPiecePosition) {
    public MoveState {
        Objects.requireNonNull(gameState);
    }
}
