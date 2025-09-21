package com.pijieh.rtc.business.messaging;

import org.springframework.http.HttpStatus;

import lombok.AllArgsConstructor;
import lombok.NonNull;

@AllArgsConstructor
public class ErrorMessage {
    @NonNull
    String gameId;

    @NonNull
    HttpStatus status;

    @NonNull
    String message;
}
