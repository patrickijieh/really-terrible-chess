package com.pijieh.chess.business.models;

import lombok.NonNull;

public class Player {

    @NonNull
    String name;

    public Player(String name) {
        this.name = name;
    }
}
