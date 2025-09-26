package com.pijieh.rtc.business.models;

import lombok.NonNull;
import lombok.Value;

@Value
public class CreateRoomForm {
    @NonNull
    String name;
}
