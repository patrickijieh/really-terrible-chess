package com.pijieh.rtc.business.messaging;

import com.pijieh.rtc.business.models.Player;

import lombok.NonNull;
import lombok.Value;

@Value
public class JoinMessage {
    @NonNull
    String gameId;

    @NonNull
    Player[] players;
}
