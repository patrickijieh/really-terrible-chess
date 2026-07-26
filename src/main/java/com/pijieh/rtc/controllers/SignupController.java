package com.pijieh.rtc.controllers;

import java.time.OffsetDateTime;

import com.pijieh.rtc.business.models.forms.LoginForm;
import com.pijieh.rtc.database.SQLDatabase;
import com.pijieh.rtc.database.models.User;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
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
    final Gson gson;
    final BCryptPasswordEncoder bcrypt;
    final SQLDatabase database;
    public SignupController(BCryptPasswordEncoder bcrypt, SQLDatabase database, Gson gson) {
        this.bcrypt = bcrypt;
        this.database = database;
        this.gson = gson;
    }

    @GetMapping("/signup")
    public String signup() {
        return "html/account.html";
    }

    @PostMapping("/signup")
    public ResponseEntity<Void> signupUser(@RequestBody LoginForm signupForm,
                                             HttpSession session) {
        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.LOCATION, "/");
        if (User.isInvalidUsername(signupForm.username())) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        String encodedPassword = bcrypt.encode(signupForm.password());
        if (!database.createUser(signupForm.username(), encodedPassword, OffsetDateTime.now())) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

        session.setAttribute("username", signupForm.username());
        return new ResponseEntity<>(headers, HttpStatus.FOUND);
    }
}
