package com.pijieh.rtc.controllers;

import java.util.Optional;

import com.pijieh.rtc.business.models.forms.LoginForm;
import com.pijieh.rtc.database.SQLDatabase;
import com.pijieh.rtc.database.models.User;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
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
    final Gson gson;
    final BCryptPasswordEncoder bcrypt;
    final SQLDatabase database;
    public LoginController(BCryptPasswordEncoder bcrypt, SQLDatabase database, Gson gson) {
        this.bcrypt = bcrypt;
        this.database = database;
        this.gson = gson;
    }

    @GetMapping("/login")
    public String login() {
        return "html/account.html";
    }

    @PostMapping("/login")
    public ResponseEntity<Void> loginUser(@RequestBody LoginForm loginForm,
                                            HttpSession session) {
        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.LOCATION, "/");
        if (User.isInvalidUsername(loginForm.username())) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        Optional<User> user = database.getUser(loginForm.username());
        if (user.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        if (!bcrypt.matches(loginForm.password(), user.get().password())) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        session.setAttribute("username", loginForm.username());
        return new ResponseEntity<>(headers, HttpStatus.FOUND);
    }
}
