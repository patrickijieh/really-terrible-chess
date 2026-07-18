package com.pijieh.rtc.business.models.forms;

import java.util.Objects;

public record JoinRoomForm(String gameId, String username) {
    public JoinRoomForm {
        Objects.requireNonNull(gameId);
        Objects.requireNonNull(username);
    }
}
