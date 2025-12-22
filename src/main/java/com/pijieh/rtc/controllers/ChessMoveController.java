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
import com.pijieh.rtc.business.messaging.ErrorMessage;
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
        Optional<Boolean> isWhitesTurn = chessRoomManager.getTurnFromId(gameId);
        String whiteUsername = chessRoomManager.getPlayersFromGame(gameId)[0].getUsername();

        if (isWhitesTurn.isEmpty()) {
            simpMessagingTemplate.convertAndSendToUser(move.getUsername(), "/" + gameId,
                    gson.toJson(new ErrorMessage(gameId, HttpStatus.NOT_FOUND, "game not found")));
            return;
        }

        if (!chessEngine.checkIfValidMove(move.getMove(), gameState,
                whiteUsername.equals(move.getUsername()), isWhitesTurn.get())) {
            sendMoveErrorMessage(gameId, move.getUsername(),
                    chessRoomManager.getChessboardFromId(gameId), isWhitesTurn.get());
            return;
        }

        Optional<String> board = chessRoomManager.makeMove(gameId, move);
        if (board.isEmpty()) {
            sendMoveErrorMessage(gameId, move.getUsername(),
                    chessRoomManager.getChessboardFromId(gameId), isWhitesTurn.get());
            return;
        }

        sendBoardUpdate(gameId, board.get(), chessRoomManager.getGameStateFromId(gameId), !isWhitesTurn.get());
    }

    private void sendMoveErrorMessage(String gameId, String player, String board, boolean isWhitesTurn) {
        final String destination = "/" + gameId;
        final String payload = gson.toJson(new MoveErrorMessage(gameId, HttpStatus.BAD_REQUEST,
                "bad move", board, isWhitesTurn));
        simpMessagingTemplate.convertAndSendToUser(player, destination, payload);
    }

    private void sendBoardUpdate(String gameId, String board, GameState gameState, boolean isWhitesTurn) {
        final String payload = gson.toJson(new MoveMessage(gameId, HttpStatus.OK, gameState,
                board, isWhitesTurn));
        simpMessagingTemplate.convertAndSend("/game-messaging/moves/" + gameId, payload);
    }
}
