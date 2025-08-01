package com.pijieh.chess.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
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
    @SendTo("/game-messaging/info/{id}")
    public ResponseEntity<String> playerJoins(@DestinationVariable(value = "id") String gameId,
            @Payload Player player, StompHeaderAccessor headerAccessor) {

        final HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        if (!chessRoomManager.playerIsInRoom(gameId, player.getName())) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        log.info("player {} has joined session {}", player.getName(), gameId);

        chessRoomManager.setPlayerSession(headerAccessor.getSessionId(), player.getName(), gameId);

        List<Map<String, String>> playerNames = chessRoomManager.getPlayerNamesFromGame(gameId);

        final String body = gson.toJson(Map.of("players", playerNames));
        return new ResponseEntity<>(body, headers, HttpStatus.OK);
    }
}
