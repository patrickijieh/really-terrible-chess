package com.pijieh.rtc.database.models;

import java.time.OffsetDateTime;
import java.util.Objects;

public record User(long id, String username, String password, int wins, int losses,
                   OffsetDateTime creationDate) {
    public User {
        Objects.requireNonNull(username);
        Objects.requireNonNull(password);
        Objects.requireNonNull(creationDate);
    }

    public static boolean isInvalidUsername(String name) {
        return name.length() < 3 || name.length() > 15;
    }
}
