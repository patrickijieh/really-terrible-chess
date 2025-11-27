package com.pijieh.rtc.business.models;

import lombok.NonNull;
import lombok.Value;

@Value
public class ChessPiece {
    public enum PieceType {
        PAWN,
        KNIGHT,
        BISHOP,
        ROOK,
        QUEEN,
        KING
    }

    @NonNull
    PieceType type;

    boolean isWhite;

    public ChessPiece(PieceType type, boolean isWhite) {
        this.type = type;
        this.isWhite = isWhite;
    }

    @Override
    public String toString() {
        String symbol = switch (type) {
            case KNIGHT -> "N";
            case BISHOP -> "B";
            case ROOK -> "R";
            case QUEEN -> "Q";
            case KING -> "K";
            default -> new String();
        };

        return symbol;
    }
}
