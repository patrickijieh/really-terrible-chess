package com.pijieh.rtc.business;

import com.pijieh.rtc.business.models.ChessPiece;
import com.pijieh.rtc.business.models.ChessPiece.PieceType;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class GameEngine {

    ChessPiece[][] defaultBoard;

    int boardSize;

    public GameEngine(String defaultBoardStr, int boardSize) {
        this.boardSize = boardSize;
        defaultBoard = parseBoard(defaultBoardStr);
    }

    public ChessPiece[][] getDefaultBoard() {
        ChessPiece[][] newBoard = new ChessPiece[boardSize][boardSize];

        for (int i = 0; i < 2; i++) {
            for (int j = 0; j < boardSize; j++) {
                ChessPiece piece = defaultBoard[i][j];
                newBoard[i][j] = new ChessPiece(piece.getType(), piece.isWhite());
            }
        }

        for (int i = boardSize - 2; i < boardSize; i++) {
            for (int j = 0; j < boardSize; j++) {
                ChessPiece piece = defaultBoard[i][j];
                newBoard[i][j] = new ChessPiece(piece.getType(), piece.isWhite());
            }
        }

        return newBoard;
    }

    private ChessPiece[][] parseBoard(String boardStr) {
        ChessPiece[][] board = new ChessPiece[boardSize][boardSize];

        boolean isWhite = false;
        for (int i = 0; i < boardStr.length(); i++) {
            if (boardStr.charAt(i) == '|') {
                isWhite = true;
                continue;
            }
            PieceType type;

            switch (boardStr.charAt(i)) {
                case 'R':
                    type = PieceType.ROOK;
                    break;
                case 'N':
                    type = PieceType.KNIGHT;
                    break;
                case 'B':
                    type = PieceType.BISHOP;
                    break;
                case 'Q':
                    type = PieceType.QUEEN;
                    break;
                case 'K':
                    type = PieceType.KING;
                    break;
                default:
                    type = PieceType.PAWN;
                    break;
            }

            BoardPosition pos;
            ChessPiece piece = new ChessPiece(type, isWhite);

            if (type != PieceType.PAWN) {
                pos = convertStringToPosition(boardStr.substring(i + 1, i + 3));
                i += 2;
            } else {
                pos = convertStringToPosition(boardStr.substring(i, i + 2));
                i++;
            }
            board[pos.getRow()][pos.getCol()] = piece;
        }
        return board;
    }

    private BoardPosition convertStringToPosition(String pos) {
        if (pos.length() != 2) {
            return null;
        }

        int row = Integer.parseInt(pos.substring(1, 2)) - 1;
        int col = pos.charAt(0) - 'a';

        return new BoardPosition(row, col);
    }

    private String convertPositionToString(int row, int col) {
        char column = (char) ('a' + col);
        return column + "" + (row + 1);
    }

    public String stringifyBoard(ChessPiece[][] board) {
        StringBuilder blackPieces = new StringBuilder();
        StringBuilder whitePieces = new StringBuilder();
        for (int i = 0; i < boardSize; i++) {
            for (int j = 0; j < boardSize; j++) {
                ChessPiece piece = board[i][j];
                if (piece == null) {
                    continue;
                }
                if (piece.isWhite()) {
                    whitePieces.append(piece.toString()
                            + convertPositionToString(i, j));
                } else {
                    blackPieces.append(piece.toString()
                            + convertPositionToString(i, j));

                }
            }
        }

        return blackPieces.toString() + "|" + whitePieces.toString();
    }
}

@lombok.Value
class BoardPosition {
    int row;
    int col;
}
