package com.pijieh.rtc.business.models;

import lombok.NonNull;
import lombok.Value;

public record ChessPiece (PieceType type, boolean isWhite) {
    public enum PieceType {
        NONE,
        GHOST_PAWN,
        PAWN,
        KNIGHT,
        BISHOP,
        ROOK,
        QUEEN,
        KING
    }

    @Override
    public String toString() {
        return switch (this.type) {
            case KNIGHT -> "N";
            case BISHOP -> "B";
            case ROOK -> "R";
            case QUEEN -> "Q";
            case KING -> "K";
            case PAWN -> "P";
            case GHOST_PAWN -> "EP";
            default -> "";
        };
    }
}
