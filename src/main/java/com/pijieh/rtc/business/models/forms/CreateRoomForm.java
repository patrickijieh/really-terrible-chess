package com.pijieh.rtc.business.models.forms;

import java.util.Objects;

public record CreateRoomForm (String username) {
    public CreateRoomForm {
        Objects.requireNonNull(username);
    }
}
