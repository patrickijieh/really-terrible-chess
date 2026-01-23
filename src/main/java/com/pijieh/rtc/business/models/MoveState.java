package com.pijieh.rtc.business.models;

import lombok.Value;
import com.pijieh.rtc.business.models.ChessGame.GameState;
import lombok.NonNull;

@Value
public class MoveState {
    boolean isValidMove;

    @NonNull
    GameState gameState;
}
