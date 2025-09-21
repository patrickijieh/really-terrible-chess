package com.pijieh.rtc.business.messaging;

import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class ReadyMessage {
    @NonNull
    String gameId;

    boolean ready = true;
}
