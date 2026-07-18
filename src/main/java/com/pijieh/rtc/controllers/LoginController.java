package com.pijieh.rtc.controllers;

import java.util.Map;
import java.util.Optional;

import com.pijieh.rtc.business.models.forms.LoginForm;
import com.pijieh.rtc.database.SQLDatabase;
import com.pijieh.rtc.database.models.User;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;

import com.google.gson.Gson;

import lombok.extern.slf4j.Slf4j;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Slf4j
@Controller
public class LoginController {
    private static final Gson gson = new Gson();
    final BCryptPasswordEncoder bcrypt;
    final SQLDatabase database;
    public LoginController(BCryptPasswordEncoder bcrypt, SQLDatabase database) {
        this.bcrypt = bcrypt;
        this.database = database;
    }

    @GetMapping("/login")
    public String login() {
        return "html/index.html";
    }

    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody LoginForm loginForm) {
        if (isInvalidUsername(loginForm.username())) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        Optional<User> user = database.getUser(loginForm.username());
        if (user.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        if (!bcrypt.matches(loginForm.password(), user.get().password())) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    private boolean isInvalidUsername(String username) {
        return username.length() < 4 || username.length() > 14;
    }
}
