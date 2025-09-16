package com.pijieh.rtc;

import java.sql.SQLException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.pijieh.rtc.business.ChessRoomManager;
import com.pijieh.rtc.database.ChessDatabase;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@SpringBootApplication
public class RTCApp {

    @Value("${chess.games.maximum}")
    int maxNumberOfChessGames;

    @Bean
    ChessDatabase database() throws SQLException {
        return new ChessDatabase();
    }

    @Bean
    ChessRoomManager ChessRoomManager() {
        return new ChessRoomManager(maxNumberOfChessGames);
    }

    public static void main(String[] args) {
        SpringApplication.run(RTCApp.class, args);
    }
}
