package com.pijieh.rtc.business.models;

import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

@Getter
@Setter
public class ChessGame {
    public enum GameState {
        NOT_READY,
        READY,
        NORMAL,
        CHECK_WHITE,
        CHECK_BLACK,
        CHECK_BOTH,
        FINISHED
    };

    @NonNull
    String id;

    @NonNull
    Player playerOne;

    Player playerTwo;

    @NonNull
    GameState gameState = GameState.NOT_READY;

    @NonNull
    ChessPiece[][] chessboard;

    BoardPosition ghostPiecePosition;

    boolean isWhitesTurn = true;

    public ChessGame(@NonNull Player owner, @NonNull String id, ChessPiece[][] startingBoard) {
        this.playerOne = owner;
        this.playerTwo = null;
        this.id = id;

        this.chessboard = startingBoard;
        this.ghostPiecePosition = null;
    }

    public boolean isReady() {
        return gameState == GameState.READY;
    }

    public boolean isPlayerOneConnected() {
        return playerOne != null && playerOne.getSocketSessionId() != null;
    }

    public boolean isPlayerTwoConnected() {
        return playerTwo != null && playerTwo.getSocketSessionId() != null;
    }
}
