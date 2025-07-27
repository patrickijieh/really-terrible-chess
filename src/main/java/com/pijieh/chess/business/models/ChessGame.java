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

    public ChessGame(@NonNull String owner) {
        playerOne = new Player(owner);
    }
}
