package com.pijieh.rtc.business.models.forms;

import java.util.Objects;

public record LoginForm(String username, String password) {
    public LoginForm {
        Objects.requireNonNull(username);
        Objects.requireNonNull(password);
    }
}
