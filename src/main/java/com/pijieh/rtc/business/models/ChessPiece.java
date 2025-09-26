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
        String symbol;
        switch (type) {
            case KNIGHT:
                symbol = "N";
                break;
            case BISHOP:
                symbol = "B";
                break;
            case ROOK:
                symbol = "R";
                break;
            case QUEEN:
                symbol = "Q";
                break;
            case KING:
                symbol = "K";
                break;
            default:
                symbol = "";
                break;
        }

        return symbol;
    }
}
