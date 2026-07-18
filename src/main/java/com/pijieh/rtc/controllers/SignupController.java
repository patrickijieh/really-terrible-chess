package com.pijieh.rtc.controllers;

import java.time.OffsetDateTime;
import java.util.Map;

import com.pijieh.rtc.business.models.forms.LoginForm;
import com.pijieh.rtc.database.SQLDatabase;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;

import com.google.gson.Gson;

import lombok.extern.slf4j.Slf4j;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Slf4j
@Controller
public class SignupController {
    private static final Gson gson = new Gson();
    final BCryptPasswordEncoder bcrypt;
    final SQLDatabase database;
    public SignupController(BCryptPasswordEncoder bcrypt, SQLDatabase database) {
        this.bcrypt = bcrypt;
        this.database = database;
    }

    @GetMapping("/signup")
    public String signup() {
        return "html/index.html";
    }

    @PostMapping("/signup")
    public ResponseEntity<String> signupUser(@RequestBody LoginForm signupForm) {
        if (isInvalidUsername(signupForm.username())) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        String encodedPassword = bcrypt.encode(signupForm.password());
        if (!database.createUser(signupForm.username(), encodedPassword, OffsetDateTime.now())) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(HttpStatus.OK);
    }

    private boolean isInvalidUsername(String username) {
        return username.length() < 4 || username.length() > 14;
    }
}
