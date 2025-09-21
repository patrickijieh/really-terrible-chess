package com.pijieh.rtc.controllers;

import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;

import com.google.gson.Gson;
import com.pijieh.rtc.business.ChessRoomManager;
import com.pijieh.rtc.business.models.CreateRoomForm;
import com.pijieh.rtc.business.models.JoinRoomForm;

import lombok.extern.slf4j.Slf4j;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Slf4j
@Controller
public class RoomController {

    private static final Gson gson = new Gson();

    @Autowired
    ChessRoomManager chessRoomManager;

    @GetMapping("/create-room")
    public String createRoom() {
        return "html/index.html";
    }

    @GetMapping("/join-room")
    public String joinRoom() {
        return "html/index.html";
    }

    @PostMapping("/create-room")
    public ResponseEntity<String> createRoomSession(@RequestBody CreateRoomForm createForm) {
        final HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Optional<String> gameId = chessRoomManager.createRoom(createForm.getName());

        if (gameId.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

        final String body = gson.toJson(Map.of("gameId", gameId.get()));
        return new ResponseEntity<>(body, headers, HttpStatus.OK);
    }

    @PostMapping("/join-room")
    public ResponseEntity<String> joinRoomSession(@RequestBody JoinRoomForm joinForm) {
        final HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Optional<String> gameId = chessRoomManager.joinRoom(joinForm.getGameId(),
                joinForm.getName());

        if (gameId.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        final String body = gson.toJson(Map.of("gameId", gameId.get()));
        return new ResponseEntity<>(body, headers, HttpStatus.OK);
    }
}
