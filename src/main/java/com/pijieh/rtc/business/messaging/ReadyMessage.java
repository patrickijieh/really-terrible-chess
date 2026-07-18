package com.pijieh.rtc.business.messaging;

import java.util.Objects;

public record ReadyMessage(String gameId, String board, boolean isPlayerWhite, boolean ready) {
    public ReadyMessage {
        Objects.requireNonNull(gameId);
        Objects.requireNonNull(board);
    }

    public ReadyMessage(String gameId, String board, boolean isPlayerWhite) {
        this(gameId, board, isPlayerWhite, true);
    }
}
