package com.pijieh.rtc.business.messaging;

import lombok.NonNull;
import lombok.Value;

@Value
public class ReadyMessage {
    @NonNull
    String gameId;

    boolean ready = true;
}
