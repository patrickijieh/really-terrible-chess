package com.pijieh.chess;

import java.sql.SQLException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.pijieh.chess.business.ChessRoomManager;
import com.pijieh.chess.database.ChessDatabase;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@SpringBootApplication
public class ChessApplication {

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
        SpringApplication.run(ChessApplication.class, args);
    }
}
