package com.pijieh.rtc.business.messaging;

import org.springframework.http.HttpStatus;

import com.pijieh.rtc.business.models.ChessGame.GameState;

import lombok.NonNull;
import lombok.Value;

@Value
public class MoveMessage {
    @NonNull
    String gameId;

    @NonNull
    HttpStatus status;

    GameState gameState;

    @NonNull
    String board;
}
