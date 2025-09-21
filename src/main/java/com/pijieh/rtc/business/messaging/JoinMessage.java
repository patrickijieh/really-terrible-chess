package com.pijieh.rtc.business.messaging;

import com.pijieh.rtc.business.models.Player;

import lombok.AllArgsConstructor;
import lombok.NonNull;

@AllArgsConstructor
public class JoinMessage {
    @NonNull
    String gameId;

    @NonNull
    Player[] players;
}
