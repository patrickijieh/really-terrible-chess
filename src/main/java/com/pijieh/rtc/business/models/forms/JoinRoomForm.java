package com.pijieh.rtc.business.models.forms;

import lombok.NonNull;
import lombok.Value;

@Value
public class JoinRoomForm {
    @NonNull
    String gameId;

    @NonNull
    String username;
}
