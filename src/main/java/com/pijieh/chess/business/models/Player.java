package com.pijieh.chess.business.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NonNull;

@AllArgsConstructor
@Getter
public class Player {

    @NonNull
    String name;
}
