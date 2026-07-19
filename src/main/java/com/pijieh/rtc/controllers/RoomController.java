package com.pijieh.rtc.controllers;

import java.util.Map;
import java.util.Optional;

import com.pijieh.rtc.database.models.User;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;

import com.google.gson.Gson;
import com.pijieh.rtc.business.ChessRoomManager;
import com.pijieh.rtc.business.models.forms.CreateRoomForm;
import com.pijieh.rtc.business.models.forms.JoinRoomForm;

import lombok.extern.slf4j.Slf4j;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Slf4j
@Controller
public class RoomController {
    final Gson gson;
    final ChessRoomManager chessRoomManager;

    public RoomController(ChessRoomManager chessRoomManager, Gson gson) {
        this.chessRoomManager = chessRoomManager;
        this.gson = gson;
    }

    @GetMapping("/create")
    public String createRoom() {
        return "html/index.html";
    }

    @GetMapping("/join")
    public String joinRoom() {
        return "html/index.html";
    }

    @PostMapping("/create")
    public ResponseEntity<String> createRoomSession(@RequestBody CreateRoomForm createForm) {
        final HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String username = createForm.username();

        if (User.isInvalidUsername(username)) {
            final String body = gson.toJson(Map.of("error", "username does not meet criteria"));
            return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
        }

        Optional<String> gameId = chessRoomManager.createRoom(username);

        if (gameId.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

        final String body = gson.toJson(Map.of("gameId", gameId.get()));
        return new ResponseEntity<>(body, headers, HttpStatus.OK);
    }

    @PostMapping("/join")
    public ResponseEntity<String> joinRoomSession(@RequestBody JoinRoomForm joinForm) {
        final HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String username = joinForm.username();

        if (User.isInvalidUsername(username)) {
            final String body = gson.toJson(Map.of("error", "username does not meet criteria"));
            return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
        }

        Optional<String> gameId = chessRoomManager.joinRoom(joinForm.gameId(),
                joinForm.username());

        if (gameId.isEmpty()) {
            final String body = gson.toJson(Map.of("error", "invalid game ID"));
            return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
        }

        final String body = gson.toJson(Map.of("gameId", gameId.get()));
        return new ResponseEntity<>(body, headers, HttpStatus.OK);
    }
}
