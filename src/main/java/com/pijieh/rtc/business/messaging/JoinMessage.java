package com.pijieh.rtc.business.messaging;

import com.pijieh.rtc.business.models.Player;

import java.util.Objects;

public record JoinMessage(String gameId, Player[] players) {
    public JoinMessage {
        Objects.requireNonNull(gameId);
        Objects.requireNonNull(players);
    }
}
