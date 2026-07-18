package com.pijieh.rtc.business.models;

import java.util.Objects;

public record ChessMove(String username, String move) {
    public ChessMove {
        Objects.requireNonNull(username);
        Objects.requireNonNull(move);
    }
}
