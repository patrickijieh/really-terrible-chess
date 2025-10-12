package com.pijieh.rtc.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import com.google.gson.Gson;
import com.pijieh.rtc.business.ChessRoomManager;
import com.pijieh.rtc.business.messaging.ErrorMessage;
import com.pijieh.rtc.business.messaging.JoinMessage;
import com.pijieh.rtc.business.messaging.ReadyMessage;
import com.pijieh.rtc.business.models.Player;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
public class GameController {

    @Autowired
    ChessRoomManager chessRoomManager;

    @Autowired
    SimpMessagingTemplate simpMessagingTemplate;

    private static final Gson gson = new Gson();

    @GetMapping("/game")
    public String game() {
        return "html/game.html";
    }

    @MessageMapping("/join/{id}")
    public void playerJoins(@DestinationVariable(value = "id") String gameId,
            @Payload Player player, StompHeaderAccessor headerAccessor) {

        final HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        if (!chessRoomManager.playerIsInRoom(gameId, player.getName())) {
            simpMessagingTemplate.convertAndSend("/game-messaging/info/" + gameId,
                    gson.toJson(new ErrorMessage(gameId, HttpStatus.NOT_FOUND, "game not found")));

            return;
        }

        log.info("player {} has joined session {}", player.getName(), gameId);

        chessRoomManager.setPlayerSession(headerAccessor.getSessionId(), player.getName(),
                gameId);

        final Player[] players = chessRoomManager.getPlayersFromGame(gameId);

        final String body = gson.toJson(new JoinMessage(gameId,
                players));

        simpMessagingTemplate.convertAndSend("/game-messaging/info/" + gameId, body);

        if (chessRoomManager.isGameReady(gameId)) {
            final String board = chessRoomManager.startGame(gameId);
            sendGameReadyMessage(gameId, board, players[0].getName(), players[1].getName());
        }
    }

    private void sendGameReadyMessage(String gameId, String board, String playerA, String playerB) {
        final String destination = "/" + gameId;
        final String payload = gson.toJson(new ReadyMessage(gameId, board));

        simpMessagingTemplate.convertAndSendToUser(playerA, destination, payload);
        simpMessagingTemplate.convertAndSendToUser(playerB, destination, payload);
    }
}
