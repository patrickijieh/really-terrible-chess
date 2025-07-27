package com.pijieh.chess.database;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.sql.DataSource;

import org.sqlite.SQLiteDataSource;

import com.mchange.v2.c3p0.DataSources;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public final class ChessDatabase {

    public enum SessionCode {
        SQL_ERROR,
        SESSION_CREATED,
        SESSION_FOUND,
        SESSION_NOT_FOUND,
        SESSION_DELETED
    }

    private DataSource dataSource;

    public ChessDatabase() throws SQLException {
        SQLiteDataSource sqliteDataSource = new SQLiteDataSource();
        String databaseUrl = "jdbc:sqlite:";
        sqliteDataSource.setUrl(databaseUrl);
        dataSource = DataSources.pooledDataSource(sqliteDataSource);
        setup();
    }

    private Connection getConnection() throws SQLException {
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
        log.info("Successfully created chess database table.");
    }

    public SessionCode createSession(String gameId, String owner) {
        try (Connection conn = getConnection();
                PreparedStatement stmt = conn
                        .prepareStatement("""
                                INSERT INTO games
                                (game_id, game_owner)
                                VALUES
                                (?, ?)
                                """)) {
            stmt.setString(1, gameId);
            stmt.setString(2, owner);
            stmt.executeUpdate();
        } catch (SQLException e) {
            log.error("", e);
            return SessionCode.SQL_ERROR;
        }

        return SessionCode.SESSION_CREATED;
    }

    public SessionCode joinSession(String gameId) {
        try (Connection conn = getConnection();
                PreparedStatement stmt = conn
                        .prepareStatement("""
                                SELECT game_id, game_owner
                                FROM games
                                WHERE game_id = ?
                                LIMIT 1
                                """)) {
            stmt.setString(1, gameId);
            ResultSet resultSet = stmt.executeQuery();

            if (!resultSet.next()) {
                resultSet.close();
                stmt.close();
                conn.close();
                return SessionCode.SESSION_NOT_FOUND;
            }
        } catch (SQLException e) {
            log.error("", e);
            return SessionCode.SQL_ERROR;
        }

        return SessionCode.SESSION_FOUND;
    }

    public SessionCode deleteSession(String gameId) {
        try (Connection conn = getConnection();
                PreparedStatement stmt = conn
                        .prepareStatement("""
                                DELETE FROM games
                                WHERE game_id = ?
                                LIMIT 1
                                """)) {
            stmt.setString(1, gameId);
            stmt.executeUpdate();

        } catch (SQLException e) {
            log.error("", e);
            return SessionCode.SQL_ERROR;
        }

        return SessionCode.SESSION_DELETED;
    }
}
