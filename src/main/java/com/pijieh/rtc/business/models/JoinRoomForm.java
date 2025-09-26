package com.pijieh.rtc.business.models;

import lombok.NonNull;
import lombok.Value;

@Value
public class JoinRoomForm {
    @NonNull
    String gameId;

    @NonNull
    String name;
}
