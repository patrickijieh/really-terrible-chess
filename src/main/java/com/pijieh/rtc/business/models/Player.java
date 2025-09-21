package com.pijieh.rtc.business.models;

import lombok.Getter;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@RequiredArgsConstructor
@Getter
@Setter
public class Player {

    @NonNull
    String name;

    transient String socketSessionId;
    transient String gameId;
}
