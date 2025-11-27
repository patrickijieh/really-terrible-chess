package com.pijieh.rtc.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
import com.pijieh.rtc.business.models.ChessGame.GameState;

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
    public void playerConnect(@DestinationVariable(value = "id") String gameId,
            @Payload Player player, StompHeaderAccessor headerAccessor) {

        if (!chessRoomManager.playerIsInRoom(gameId, player.getUsername())) {
            simpMessagingTemplate.convertAndSend("/game-messaging/info/" + gameId,
                    gson.toJson(new ErrorMessage(gameId, HttpStatus.NOT_FOUND, "game not found")));

            return;
        }

        log.info("player {} has joined session {}", player.getUsername(), gameId);

        chessRoomManager.setPlayerSession(headerAccessor.getSessionId(), player.getUsername(),
                gameId);

        final Player[] players = chessRoomManager.getPlayersFromGame(gameId);

        final String body = gson.toJson(new JoinMessage(gameId, players));

        simpMessagingTemplate.convertAndSend("/game-messaging/info/" + gameId, body);

        if (chessRoomManager.getGameStateFromId(gameId) == GameState.READY) {
            final String board = chessRoomManager.startGame(gameId);
            sendGameReadyMessage(gameId, board, players[0].getUsername(),
                    players[1].getUsername());
        }
    }

    private void sendGameReadyMessage(String gameId, String board, String playerOne, String playerTwo) {
        final String destination = "/" + gameId;

        final String payloadOne = gson.toJson(new ReadyMessage(gameId, board, true));
        final String payloadTwo = gson.toJson(new ReadyMessage(gameId, board, false));

        simpMessagingTemplate.convertAndSendToUser(playerOne, destination, payloadOne);
        simpMessagingTemplate.convertAndSendToUser(playerTwo, destination, payloadTwo);
    }
}
