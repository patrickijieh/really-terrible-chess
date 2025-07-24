package com.pijieh.chess.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
@RequestMapping("/")
public class RoomController {

    @GetMapping("/create-room")
    public String createRoom() {
        return "html/create_room.html";
    }

    @GetMapping("/join-room")
    public String joinRoom() {
        return "html/join_room.html";
    }

    @PostMapping("/create-room")
    public ResponseEntity<String> createRoomSession() {
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/join-room")
    public ResponseEntity<String> joinRoomSession() {
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
