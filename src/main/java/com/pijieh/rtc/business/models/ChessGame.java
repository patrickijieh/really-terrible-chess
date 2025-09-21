package com.pijieh.rtc.business.models;

import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

@Getter
@Setter
public class ChessGame {

    @NonNull
    Player playerOne;

    Player playerTwo;

    @NonNull
    Boolean started = false;

    public ChessGame(@NonNull Player owner) {
        playerOne = owner;
    }

    public boolean isReady() {
        if (playerTwo == null) {
            return false;
        }
        return playerOne.getSocketSessionId() != null && playerTwo.getSocketSessionId() != null;
    }
}
