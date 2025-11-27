package com.pijieh.rtc.business.messaging;

import lombok.NonNull;
import lombok.Value;

@Value
public class ReadyMessage {
    @NonNull
    String gameId;

    @NonNull
    String board;

    boolean isPlayerWhite;

    boolean ready = true;
}
