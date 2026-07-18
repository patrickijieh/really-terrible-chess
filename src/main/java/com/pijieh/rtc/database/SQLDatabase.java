package com.pijieh.rtc.database;

import com.pijieh.rtc.database.models.User;

import java.beans.PropertyVetoException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.Optional;

import javax.sql.DataSource;

import com.mchange.v2.c3p0.ComboPooledDataSource;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public final class SQLDatabase {
    private final DataSource dataSource;

    public SQLDatabase(String databaseDriver, String databaseUri, String databaseUsername,
                       String databasePassword)
            throws PropertyVetoException, SQLException {
        ComboPooledDataSource cpds = new ComboPooledDataSource();
        cpds.setDriverClass(databaseDriver);
        cpds.setJdbcUrl(databaseUri);
        cpds.setUser(databaseUsername);
        cpds.setPassword(databasePassword);
        dataSource = cpds;
        testConnection();
    }

    private Connection getConnection() throws SQLException {
        return dataSource.getConnection();
    }

    private void testConnection() throws SQLException {
        try (Connection conn = getConnection();) {
        }
        log.info("Successfully fulfilled connection to RTC database.");
    }

    public boolean createChessGame(String gameId, String ownerUsername) {
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn
                     .prepareStatement("""
                                INSERT INTO chess_games
                                (game_id, owner_username, finished)
                                VALUES
                                (?, ?, ?)
                                """)) {
            stmt.setString(1, gameId);
            stmt.setString(2, ownerUsername);
            stmt.setBoolean(3, false);
            stmt.executeUpdate();
        } catch (SQLException e) {
            log.error("err: ", e);
            return false;
        }

        return true;
    }

    public boolean joinChessGame(String gameId, String opponentUsername) {
        try (Connection conn = getConnection();
                PreparedStatement stmt = conn
                        .prepareStatement("""
                                UPDATE chess_games
                                SET opponent_username = ?
                                WHERE game_id = ?
                                """)) {
            stmt.setString(1, opponentUsername);
            stmt.setString(2, gameId);
            stmt.executeUpdate();
        } catch (SQLException e) {
            log.error("", e);
            return false;
        }

        return true;
    }

    public boolean chessGameExists(String gameId) {
        try (Connection conn = getConnection();
                PreparedStatement stmt = conn
                        .prepareStatement("""
                                SELECT game_id
                                FROM chess_games
                                WHERE game_id = ?
                                LIMIT 1
                                """)) {
            stmt.setString(1, gameId);
            ResultSet resultSet = stmt.executeQuery();

            if (!resultSet.next()) {
                resultSet.close();
                stmt.close();
                conn.close();
                return false;
            }
        } catch (SQLException e) {
            log.error("", e);
            return false;
        }

        return true;
    }

    public boolean deleteChessGame(String gameId) {
        try (Connection conn = getConnection();
                PreparedStatement stmt = conn
                        .prepareStatement("""
                                DELETE FROM chess_games
                                WHERE game_id = ?
                                """)) {
            stmt.setString(1, gameId);
            stmt.executeUpdate();

        } catch (SQLException e) {
            log.error("err: ", e);
            return false;
        }

        return true;
    }

    public boolean createUser(String username, String encryptedPassword, OffsetDateTime timestamp) {
        try (Connection conn = getConnection();
                PreparedStatement stmt = conn
                        .prepareStatement("""
                                INSERT INTO users
                                (username, password, wins, losses, creation_date)
                                VALUES
                                (?, ?, ?, ?, ?)
                                """)) {
            stmt.setString(1, username);
            stmt.setString(2, encryptedPassword);
            stmt.setInt(3, 0);
            stmt.setInt(4, 0);
            stmt.setTimestamp(5, new Timestamp(timestamp.toInstant().toEpochMilli()));
            stmt.executeUpdate();

        } catch (SQLException e) {
            log.error("err: ", e);
            return false;
        }

        return true;

    }

    public Optional<User> getUser(String username) {
        long id;
        String password;
        int wins;
        int losses;
        OffsetDateTime creationDate;
        try (Connection conn = getConnection();
                PreparedStatement stmt = conn
                        .prepareStatement("""
                                SELECT *
                                FROM users
                                WHERE username = ?
                                LIMIT 1
                                """)) {
            stmt.setString(1, username);
            ResultSet resultSet = stmt.executeQuery();
            if (!resultSet.next()) {
                resultSet.close();
                stmt.close();
                conn.close();
                return Optional.empty();
            }
            id = resultSet.getLong("id");
            password = resultSet.getString("password");
            wins = resultSet.getInt("wins");
            losses = resultSet.getInt("losses");
            creationDate = OffsetDateTime.ofInstant(
                    resultSet.getTimestamp("creation_date").toInstant(), ZoneId.systemDefault());

        } catch (SQLException e) {
            log.error("err: ", e);
            return Optional.empty();
        }

        return Optional.of(new User(id, username, password, wins, losses, creationDate));
    }
}
