package com.pijieh.rtc.business.models;

import lombok.NonNull;
import lombok.Value;

@Value
public class ChessMove {
    @NonNull
    String username;

    @NonNull
    String move;
}
