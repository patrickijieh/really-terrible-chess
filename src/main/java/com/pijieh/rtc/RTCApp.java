package com.pijieh.rtc;

import java.beans.PropertyVetoException;
import java.sql.SQLException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.pijieh.rtc.business.ChessEngine;
import com.pijieh.rtc.business.ChessRoomManager;
import com.pijieh.rtc.database.SQLDatabase;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Slf4j
@SpringBootApplication
public class RTCApp {
    @Value("${chess.games.maximum}")
    int maxNumberOfChessGames;

    @Value("${chess.board.starting-str}")
    String defaultBoardStr;

    @Value("${chess.board.size}")
    int boardSize;

    @Value("${database.driver}")
    String databaseDriver;

    @Value("${database.uri}")
    String databaseUri;

    @Value("${database.username}")
    String databaseUsername;

    @Value("${database.password}")
    String databasePassword;

    @Bean
    SQLDatabase database() throws PropertyVetoException, SQLException {
        return new SQLDatabase(databaseDriver, databaseUri, databaseUsername, databasePassword);
    }

    @Bean
    ChessRoomManager ChessRoomManager() {
        return new ChessRoomManager(maxNumberOfChessGames);
    }

    @Bean
    ChessEngine chessEngine() {
        return new ChessEngine(defaultBoardStr, boardSize);
    }

    @Bean
    BCryptPasswordEncoder bcrypt() {
        return new BCryptPasswordEncoder();
    }

    public static void main(String[] args) {
        SpringApplication.run(RTCApp.class, args);
    }
}
