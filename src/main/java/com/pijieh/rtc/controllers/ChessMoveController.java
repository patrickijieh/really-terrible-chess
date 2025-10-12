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

import com.google.gson.Gson;
import com.pijieh.rtc.business.ChessRoomManager;
import com.pijieh.rtc.business.messaging.ErrorMessage;
import com.pijieh.rtc.business.messaging.JoinMessage;
import com.pijieh.rtc.business.messaging.ReadyMessage;
import com.pijieh.rtc.business.models.Player;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
public class ChessMoveController {

    @Autowired
    ChessRoomManager chessRoomManager;

    @Autowired
    SimpMessagingTemplate simpMessagingTemplate;

    private static final Gson gson = new Gson();

    @MessageMapping("/move")
    public void playerMove() {

    }
}
