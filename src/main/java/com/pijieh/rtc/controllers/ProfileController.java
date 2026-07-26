package com.pijieh.rtc.controllers;

import com.google.gson.Gson;
import com.pijieh.rtc.database.SQLDatabase;
import com.pijieh.rtc.database.models.User;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.time.OffsetDateTime;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Controller
public class ProfileController {
    final Gson gson;
    final SQLDatabase database;
    public ProfileController(SQLDatabase database, Gson gson) {
        this.database = database;
        this.gson = gson;
    }

    @GetMapping("/profile")
    public String profile(HttpSession session) {
        if (session.getAttribute("username") == null) {
            return "redirect:/";
        }

        return "html/profile.html";
    }

    @GetMapping("/profile/{username}")
    public ResponseEntity<String> userProfileFromId(@PathVariable String username) {
        Optional<User> user = database.getUser(username);
        if (user.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        int wins = user.get().wins();
        int losses = user.get().losses();
        OffsetDateTime creationDate = user.get().creationDate();
        String body = gson.toJson(Map.of("username", username, "wins", wins, "losses", losses,
                "creationDate", creationDate));
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
