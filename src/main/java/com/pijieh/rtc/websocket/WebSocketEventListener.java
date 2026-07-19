package com.pijieh.rtc.websocket;

import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import com.pijieh.rtc.business.ChessRoomManager;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class WebSocketEventListener {
    final ChessRoomManager chessRoomManager;
    public WebSocketEventListener(ChessRoomManager chessRoomManager) {
        this.chessRoomManager = chessRoomManager;
    }

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        log.debug("New socket connection from id {}", headerAccessor.getSessionId());
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        log.debug("Session id {} disconnected", headerAccessor.getSessionId());

        // TODO: Should be handled through something different (a player manager?)
        log.debug("finding and removing session associated with socket session id {}",
                headerAccessor.getSessionId());
        chessRoomManager.removePlayer(headerAccessor.getSessionId());
    }
}
