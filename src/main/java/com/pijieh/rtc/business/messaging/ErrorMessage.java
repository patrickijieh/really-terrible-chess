package com.pijieh.rtc.business.messaging;

import org.springframework.http.HttpStatus;

import lombok.NonNull;
import lombok.Value;

@Value
public class ErrorMessage {
    @NonNull
    String gameId;

    @NonNull
    HttpStatus status;

    @NonNull
    String message;
}
