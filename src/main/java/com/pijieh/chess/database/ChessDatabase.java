package com.pijieh.chess.database;

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;

import javax.sql.DataSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sqlite.SQLiteDataSource;

import com.mchange.v2.c3p0.DataSources;

public final class ChessDatabase {

    private DataSource dataSource;
    private static final Logger logger = LoggerFactory.getLogger(ChessDatabase.class);

    public ChessDatabase() throws SQLException {
        SQLiteDataSource sqliteDataSource = new SQLiteDataSource();
        String databaseUrl = "jdbc:sqlite:";
        sqliteDataSource.setUrl(databaseUrl);
        dataSource = DataSources.pooledDataSource(sqliteDataSource);
        setup();
    }

    public Connection getConnection() throws SQLException {
        return dataSource.getConnection();
    }

    private void setup() throws SQLException {
        Connection conn = getConnection();
        Statement stmt = conn.createStatement();
        stmt.executeUpdate("""
                create table if not exists games (
                        game_id TEXT PRIMARY KEY NOT NULL,
                        game_owner TEXT NOT NULL
                    )""");
        stmt.close();
        conn.close();
        logger.info("Successfully created chess database table.");
    }
}
