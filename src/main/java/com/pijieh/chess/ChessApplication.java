package com.pijieh.chess;

import java.sql.SQLException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.pijieh.chess.business.ChessRoomManager;
import com.pijieh.chess.database.ChessDatabase;

@SpringBootApplication
public class ChessApplication {

    private static final Logger logger = LoggerFactory.getLogger(ChessApplication.class);

    @Bean
    ChessDatabase database() throws SQLException {
        return new ChessDatabase();
    }

    @Bean
    ChessRoomManager ChessRoomManager() {
        return new ChessRoomManager();
    }

    public static void main(String[] args) {
        SpringApplication.run(ChessApplication.class, args);
    }
}
