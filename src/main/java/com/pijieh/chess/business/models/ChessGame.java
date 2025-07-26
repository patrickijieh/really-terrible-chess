package com.pijieh.chess.business.models;

import lombok.NonNull;

public class ChessGame {

    @NonNull
    Player playerOne;
    Player playerTwo;

    public ChessGame(@NonNull String owner) {
        playerOne = new Player(owner);
    }

    public void setPlayerTwo(@NonNull String playerTwo) {
        this.playerTwo = new Player(playerTwo);
    }
}
