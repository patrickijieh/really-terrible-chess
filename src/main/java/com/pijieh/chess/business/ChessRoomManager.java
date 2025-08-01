package com.pijieh.chess.business;

import java.util.concurrent.ConcurrentHashMap;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;

import com.pijieh.chess.business.models.ChessGame;
import com.pijieh.chess.business.models.Player;
import com.pijieh.chess.database.ChessDatabase;
import com.pijieh.chess.database.ChessDatabase.SessionCode;

import lombok.extern.slf4j.Slf4j;

// TODO: Separate player map into different manager
@Slf4j
public final class ChessRoomManager {

    @Autowired
    ChessDatabase database;

    int maxGames;
    int maxPlayers;
    ConcurrentHashMap<String, ChessGame> chessGames;
    ConcurrentHashMap<String, Player> playerMap;

    public ChessRoomManager(int maxNumberOfChessGames) {
        this.maxGames = maxNumberOfChessGames;
        this.maxPlayers = maxNumberOfChessGames * 2;
        ConcurrentHashMap<String, ChessGame> games = new ConcurrentHashMap<>(maxGames);
        ConcurrentHashMap<String, Player> players = new ConcurrentHashMap<>(maxPlayers);
        this.chessGames = games;
        this.playerMap = players;
    }

    public Optional<String> createRoom(String owner) {
        final String gameId = Long.toHexString(UUID.randomUUID().getMostSignificantBits())
                .toUpperCase();

        if (database.createSession(gameId, owner) != SessionCode.SESSION_CREATED) {
            return Optional.empty();
        }
        Player playerOne = new Player(owner);
        ChessGame newGame = new ChessGame(playerOne);
        chessGames.put(gameId, newGame);
        log.info("Created new session with gameId: {}", gameId);
        return Optional.of(gameId);
    }

    public Optional<String> joinRoom(String gameId, String player) {
        if (database.joinSession(gameId) != SessionCode.SESSION_FOUND) {
            return Optional.empty();
        }

        ChessGame game = chessGames.get(gameId);
        game.setPlayerTwo(new Player(player));
        return Optional.of(gameId);
    }

    public boolean playerIsInRoom(String gameId, String playerName) {
        ChessGame game = chessGames.get(gameId);

        if (null == game) {
            return false;
        }

        if (null == game.getPlayerTwo()) {
            return game.getPlayerOne().getName().equals(playerName);
        }

        return game.getPlayerOne().getName().equals(playerName) ||
                game.getPlayerTwo().getName().equals(playerName);
    }

    public void setPlayerSession(String socketSessionId, String playerName, String gameId) throws RuntimeException {
        ChessGame game = chessGames.get(gameId);

        if (null == game) {
            throw new RuntimeException("game id is somehow not valid; resort to crashing & burning");
        }

        if (game.getPlayerOne().getName().equals(playerName)) {
            game.getPlayerOne().setSocketSessionId(socketSessionId);
            game.getPlayerOne().setGameId(gameId);
            playerMap.put(socketSessionId, game.getPlayerOne());
        } else {
            game.getPlayerTwo().setSocketSessionId(socketSessionId);
            game.getPlayerTwo().setGameId(gameId);
            playerMap.put(socketSessionId, game.getPlayerTwo());
        }

        if (game.isReady()) {
            log.info("game {} is ready to start", gameId);
        }
    }

    public Player[] getPlayersFromGame(String gameId) {
        Player[] players = new Player[2];
        ChessGame game = this.chessGames.get(gameId);

        if (null == game) {
            return players;
        }

        players[0] = game.getPlayerOne();
        players[1] = game.getPlayerTwo();
        return players;
    }

    public List<Map<String, String>> getPlayerNamesFromGame(String gameId) {
        Player[] players = getPlayersFromGame(gameId);

        List<Map<String, String>> playerNames = new ArrayList<>();
        for (int i = 0; i < players.length; i++) {
            if (players[i] == null) {
                continue;
            }
            Map<String, String> p = Map.of("name", players[i].getName());
            playerNames.add(p);
        }

        return playerNames;
    }

    public void removePlayer(String socketSessionId) {
        Player disconnectedPlayer = playerMap.get(socketSessionId);

        destroyRoom(disconnectedPlayer.getGameId());
        playerMap.remove(socketSessionId);
    }

    private void destroyRoom(String gameId) {
        if (database.deleteSession(gameId) != SessionCode.SESSION_DELETED) {
            return;
        }

        chessGames.remove(gameId);
    }
}
