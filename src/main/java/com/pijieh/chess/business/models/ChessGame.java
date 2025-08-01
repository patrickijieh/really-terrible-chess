package com.pijieh.chess.business.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class ChessGame {

    @NonNull
    Player playerOne;
    Player playerTwo;

    public ChessGame(@NonNull Player owner) {
        playerOne = owner;
    }

    public boolean isReady() {
        if (null == playerTwo) {
            return false;
        }
        return playerOne.getSocketSessionId() != null && playerTwo.getSocketSessionId() != null;
    }
}
