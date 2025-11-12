package com.pijieh.rtc.business.messaging;

import org.springframework.http.HttpStatus;

import lombok.NonNull;
import lombok.Value;

@Value
public class MoveErrorMessage {
    @NonNull
    String gameId;

    @NonNull
    HttpStatus status;

    @NonNull
    String message;

    @NonNull
    String board;
}
