package com.pijieh.chess.controllers;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Map;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.google.gson.Gson;
import com.pijieh.chess.database.ChessDatabase;
import com.pijieh.chess.models.CreateRoomForm;
import com.pijieh.chess.models.JoinRoomForm;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Controller
@RequestMapping("/")
public class RoomController {

    private final static Gson gson = new Gson();
    private final static Logger logger = LoggerFactory.getLogger(RoomController.class);

    @Autowired
    ChessDatabase dataSource;

    @GetMapping("/create-room")
    public String createRoom() {
        return "html/create_room.html";
    }

    @GetMapping("/join-room")
    public String joinRoom() {
        return "html/join_room.html";
    }

    @PostMapping("/create-room")
    public ResponseEntity<String> createRoomSession(@RequestBody CreateRoomForm createForm) {
        final String gameId = Long.toHexString(UUID.randomUUID().getMostSignificantBits());
        final HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        try (Connection conn = dataSource.getConnection();
                PreparedStatement stmt = conn
                        .prepareStatement("INSERT INTO games (game_id, game_owner) VALUES (?, ?)")) {
            stmt.setString(1, gameId);
            stmt.setString(2, createForm.getName());
            stmt.executeUpdate();
        } catch (SQLException e) {
            logger.error("", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

        final String body = gson.toJson(Map.of("id", gameId));
        return new ResponseEntity<>(body, headers, HttpStatus.OK);
    }

    @PostMapping("/join-room")
    public ResponseEntity<String> joinRoomSession(@RequestBody JoinRoomForm joinForm) {
        final HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        try (Connection conn = dataSource.getConnection();
                PreparedStatement stmt = conn
                        .prepareStatement("SELECT game_id, game_owner FROM games WHERE game_id = ? LIMIT 1")) {
            stmt.setString(1, joinForm.getGameId());
            ResultSet rs = stmt.executeQuery();

            if (!rs.next()) {
                rs.close();
                stmt.close();
                conn.close();
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (SQLException e) {
            logger.error("", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
