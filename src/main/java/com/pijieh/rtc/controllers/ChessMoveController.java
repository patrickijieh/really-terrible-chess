package com.pijieh.rtc.controllers;

import java.util.Optional;

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
import com.pijieh.rtc.business.messaging.MoveMessage;
import com.pijieh.rtc.business.models.ChessMove;
import com.pijieh.rtc.business.models.ChessGame.GameState;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
public class ChessMoveController {
    final Gson gson;
    final ChessRoomManager chessRoomManager;
    final ChessEngine chessEngine;
    final SimpMessagingTemplate simpMessagingTemplate;

    public ChessMoveController(ChessRoomManager chessRoomManager, ChessEngine chessEngine,
                               SimpMessagingTemplate simpMessagingTemplate, Gson gson) {
        this.chessRoomManager = chessRoomManager;
        this.chessEngine = chessEngine;
        this.simpMessagingTemplate = simpMessagingTemplate;
        this.gson = gson;
    }

    @MessageMapping("/send-move/{id}")
    public void playerMove(@DestinationVariable(value = "id") String gameId,
            @Payload ChessMove move, StompHeaderAccessor headerAccessor) {

        final GameState gameState = chessRoomManager.getGameStateFromId(gameId);
        final Optional<Boolean> isWhitesTurn = chessRoomManager.getTurnFromId(gameId);
        final String whiteUsername = chessRoomManager.getPlayersFromGame(gameId)[0].getUsername();

        if (isWhitesTurn.isEmpty()) {
            simpMessagingTemplate.convertAndSendToUser(move.username(), "/" + gameId,
                    gson.toJson(new ErrorMessage(gameId, HttpStatus.NOT_FOUND, "game not found")));
            return;
        }

        if (!chessEngine.checkIfValidMove(move.move(), gameState,
                whiteUsername.equals(move.username()), isWhitesTurn.get())) {
            sendMoveErrorMessage(gameId, move.username(),
                    chessRoomManager.getChessboardFromId(gameId), isWhitesTurn.get());
            return;
        }

        Optional<String> message = chessRoomManager.makeMove(gameId, move);
        if (message.isEmpty()) {
            sendMoveErrorMessage(gameId, move.username(),
                    chessRoomManager.getChessboardFromId(gameId), isWhitesTurn.get());
            return;
        }

        if (chessRoomManager.getGameStateFromId(gameId) == GameState.FINISHED) {
            String playerColor = isWhitesTurn.get() ? "w" : "b";
            log.info("game with id={} finished, {} player won", gameId, playerColor);
        }

        log.debug("board state:\n{}\n", chessRoomManager.getPrettyBoardStr(gameId));

        sendBoardUpdate(gameId, message.get(), chessRoomManager.getGameStateFromId(gameId), !isWhitesTurn.get());
    }

    private void sendMoveErrorMessage(String gameId, String player, String board, boolean isWhitesTurn) {
        final String destination = "/" + gameId;
        final String payload = gson.toJson(new ErrorMessage(gameId, HttpStatus.BAD_REQUEST,
                "bad move", board, isWhitesTurn));
        simpMessagingTemplate.convertAndSendToUser(player, destination, payload);
    }

    private void sendBoardUpdate(String gameId, String board, GameState gameState, boolean isWhitesTurn) {
        final String payload = gson.toJson(new MoveMessage(gameId, HttpStatus.OK, gameState,
                board, isWhitesTurn));
        simpMessagingTemplate.convertAndSend("/game-messaging/moves/" + gameId, payload);
    }
}
