package com.pijieh.chess.controllers;

import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import com.google.gson.Gson;
import com.pijieh.chess.business.ChessRoomManager;
import com.pijieh.chess.business.models.Player;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
public class GameController {

    @Autowired
    ChessRoomManager chessRoomManager;

    private static final Gson gson = new Gson();

    @GetMapping("/game")
    public String game() {
        return "html/index.html";
    }

    @MessageMapping("/join/{id}")
    @SendTo("/game/info")
    public ResponseEntity<String> playerJoins(@DestinationVariable(value = "id") String gameId,
            @Payload Player player) {

        if (!chessRoomManager.playerIsInRoom(gameId, player.getName())) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
