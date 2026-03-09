package com.pijieh.rtc.business.models.forms;

import lombok.NonNull;
import lombok.Value;

@Value
public class CreateRoomForm {
    @NonNull
    String username;
}
