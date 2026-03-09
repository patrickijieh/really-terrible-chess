package com.pijieh.rtc;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import com.pijieh.rtc.business.ChessEngine;
import com.pijieh.rtc.business.models.ChessGame.GameState;

@SpringBootTest
class ChessEngineTests {

    ChessEngine engine;

    @BeforeEach
    void setup() {
        engine = new ChessEngine(getBoardString(), getBoardSize());
    }

    @Test
    void init() {
    }

    @Test
    void checkValidStrings() {
        String move = "ba2>a3";
        String capture = "wQc4>xe6";
        String castle = "wO-O";
        String promotion = "bBh2>h1(Q)";
        String check = "bQh2>h1+";
        String mate = "bQh2>xa2#";

        assertTrue(engine.checkIfValidMove(move, GameState.NORMAL, false, false));
        assertTrue(engine.checkIfValidMove(capture, GameState.NORMAL, true, true));
        assertTrue(engine.checkIfValidMove(castle, GameState.NORMAL, true, true));
        assertTrue(engine.checkIfValidMove(promotion, GameState.NORMAL, false, false));
        assertTrue(engine.checkIfValidMove(check, GameState.NORMAL, false, false));
        assertTrue(engine.checkIfValidMove(mate, GameState.NORMAL, false, false));
    }

    @Test
    void checkInvalidMoves() {
        String move1 = "f";
        String move2 = "jaejawadjakddljdkajsfajdlk";
        String move3 = "w; DROP TABLE users;";
        String move4 = "O-O-O";
        String move5 = "Qh2>h1";
        String move6 = "wQh2>h1"; // check for player playing out of turn

        assertFalse(engine.checkIfValidMove(move1, GameState.NORMAL, true, true));
        assertFalse(engine.checkIfValidMove(move2, GameState.NORMAL, true, true));
        assertFalse(engine.checkIfValidMove(move3, GameState.NORMAL, true, true));
        assertFalse(engine.checkIfValidMove(move4, GameState.NORMAL, true, true));
        assertFalse(engine.checkIfValidMove(move5, GameState.NORMAL, true, true));
        assertFalse(engine.checkIfValidMove(move6, GameState.NORMAL, true, false));
    }

    String getBoardString() {
        return "Ra8Nb8Bc8Qd8Ke8Bf8Ng8Rh8a7b7c7d7e7f7g7h7|Ra1Nb1Bc1Qd1Ke1Bf1Ng1Rh1a2b2c2d2e2f2g2h2";
    }

    int getBoardSize() {
        return 8;
    }
}
