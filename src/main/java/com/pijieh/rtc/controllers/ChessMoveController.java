package com.pijieh.rtc.controllers;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Controller;

import com.google.gson.Gson;
import com.pijieh.rtc.business.ChessEngine;
import com.pijieh.rtc.business.ChessRoomManager;
import com.pijieh.rtc.business.messaging.MoveErrorMessage;
import com.pijieh.rtc.business.messaging.MoveMessage;
import com.pijieh.rtc.business.models.ChessMove;
import com.pijieh.rtc.business.models.ChessGame.GameState;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
public class ChessMoveController {

    @Autowired
    ChessRoomManager chessRoomManager;

    @Autowired
    ChessEngine chessEngine;

    @Autowired
    SimpMessagingTemplate simpMessagingTemplate;

    private static final Gson gson = new Gson();

    @MessageMapping("/send-move/{id}")
    public void playerMove(@DestinationVariable(value = "id") String gameId,
            @Payload ChessMove move, StompHeaderAccessor headerAccessor) {

        GameState gameState = chessRoomManager.getGameStateFromId(gameId);
        if (!chessEngine.checkIfValidMove(move.getMove(), gameState)) {
            sendMoveErrorMessage(gameId, move.getUsername(),
                    chessRoomManager.getChessboardFromId(gameId));
            return;
        }

        Optional<String> board = chessRoomManager.makeMove(gameId, move);
        if (board.isEmpty()) {
            sendMoveErrorMessage(gameId, move.getUsername(),
                    chessRoomManager.getChessboardFromId(gameId));
            return;
        }

        sendBoardUpdate(gameId, board.get());
    }

    private void sendMoveErrorMessage(String gameId, String player, String board) {
        final String destination = "/" + gameId;
        final String payload = gson.toJson(new MoveErrorMessage(gameId, HttpStatus.BAD_REQUEST,
                "bad move", board));
        simpMessagingTemplate.convertAndSendToUser(player, destination, payload);
    }

    private void sendBoardUpdate(String gameId, String board) {
        final String payload = gson.toJson(new MoveMessage(gameId, HttpStatus.OK, GameState.NORMAL,
                board));
        simpMessagingTemplate.convertAndSend("/game-messaging/moves/" + gameId, payload);
    }
}
