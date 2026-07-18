package com.pijieh.rtc.business.messaging;

import org.springframework.http.HttpStatus;

import java.util.Objects;

public record ErrorMessage(String gameId, HttpStatus status, String message, String board, Boolean isWhitesTurn) {
    public ErrorMessage {
        Objects.requireNonNull(gameId);
        Objects.requireNonNull(status);
        Objects.requireNonNull(message);
    }
    public ErrorMessage(String gameId, HttpStatus status, String message) {
        this(gameId, status, message, null, null);
    }
}
