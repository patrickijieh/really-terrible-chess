package com.pijieh.rtc.business;

import com.pijieh.rtc.business.models.ChessPiece;
import com.pijieh.rtc.business.models.ChessPiece.PieceType;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class ChessEngine {

    ChessPiece[][] defaultBoard;

    int boardSize;

    public ChessEngine(String defaultBoardStr, int boardSize) {
        this.boardSize = boardSize;
        defaultBoard = parseBoard(defaultBoardStr);
    }

    public void validateMove(ChessPiece[][] board, PieceType type, boolean pieceIsWhite, int row,
            int col, int newRow, int newCol) {
        assert row < 8 && row >= 0;
        assert col < 8 && col >= 0;
        assert newRow < 8 && newRow >= 0;
        assert newCol < 8 && newCol >= 0;

        ChessPiece piece = board[row][col];
        ChessPiece potentialPiece = board[newRow][newCol];

        if (piece == null || piece.getType() != type) {
            return;
        }

        if (potentialPiece != null) {
            if (!(potentialPiece.isWhite() ^ pieceIsWhite)) {
                return;
            }
        }

        boolean validMove;
        switch (piece.getType()) {
            case KNIGHT:
                validMove = validateKnightMove(row, col, newRow, newCol);
                break;
            case BISHOP:
                validMove = validateBishopMove(row, col, newRow, newCol);
                break;
            case ROOK:
                validMove = validateRookMove(row, col, newRow, newCol);
                break;
            case QUEEN:
                validMove = validateQueenMove(row, col, newRow, newCol);
                break;
            case KING:
                validMove = validateKingMove(row, col, newRow, newCol);
                break;
            default:
                validMove = validatePawnMove(row, col, newRow, newCol, pieceIsWhite, false);
                break;
        }

        if (!validMove) {
            return;
        }

        board[newRow][newCol] = piece;
        board[row][col] = null;
    }

    private boolean validateKnightMove(int row, int col, int newRow, int newCol) {
        if (row - 2 == newRow || row + 2 == newRow) {
            if (col - 1 == newCol || col + 1 == newCol) {
                return true;
            }
        } else if (col - 2 == newCol || col + 2 == newCol) {
            if (row - 1 == newRow || row + 1 == newRow) {
                return true;
            }
        }

        return false;
    }

    private boolean validateBishopMove(int row, int col, int newRow, int newCol) {
        boolean neBlocked = false;
        boolean nwBlocked = false;
        boolean seBlocked = false;
        boolean swBlocked = false;
        for (int i = 0; i < 8; i++) {
            if (!nwBlocked) {
                if (row - i < 0 || col - i < 0) {
                    nwBlocked = true;
                } else {
                    if (row - i == newRow && col - i == newCol) {
                        return true;
                    }
                }
            }
            if (!neBlocked) {
                if (row - i < 0 || col + i > 7) {
                    neBlocked = true;
                } else {
                    if (row - i == newRow && col + i == newCol) {
                        return true;
                    }
                }
            }
            if (!swBlocked) {
                if (row + i > 7 || col - i < 0) {
                    neBlocked = true;
                } else {
                    if (row + i == newRow && col - i == newCol) {
                        return true;
                    }
                }
            }
            if (!seBlocked) {
                if (row + i < 7 || col + i > 7) {
                    neBlocked = true;
                } else {
                    if (row + i == newRow && col + i == newCol) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    private boolean validateRookMove(int row, int col, int newRow, int newCol) {
        if (row == newRow || col == newCol) {
            return true;
        }
        return false;
    }

    private boolean validateQueenMove(int row, int col, int newRow, int newCol) {
        if (validateBishopMove(row, col, newRow, newCol)
                || validateRookMove(row, col, newRow, newCol)) {
            return true;
        }

        return false;
    }

    private boolean validateKingMove(int row, int col, int newRow, int newCol) {
        if (Math.abs(row - newRow) <= 1 && Math.abs(col - newCol) <= 1) {
            return true;
        }
        return false;
    }

    private boolean validatePawnMove(int row, int col, int newRow, int newCol, boolean pieceIsWhite, boolean capture) {
        if (!capture) {
            if (pieceIsWhite && newRow - row == 1 && newCol == col) {
                return true;
            } else if (!pieceIsWhite && row - newRow == 1 && newCol == col) {
                return true;
            }
        } else {
            if (pieceIsWhite && newRow - row == 1 && Math.abs(col - newCol) == 1) {
                return true;
            } else if (!pieceIsWhite && row - newRow == 1 && Math.abs(col - newCol) == 1) {
                return true;
            }
        }
        return false;
    }

    public ChessPiece[][] getDefaultBoard() {
        ChessPiece[][] newBoard = new ChessPiece[boardSize][boardSize];

        // top of the board
        for (int i = 0; i < 2; i++) {
            for (int j = 0; j < boardSize; j++) {
                ChessPiece piece = defaultBoard[i][j];
                newBoard[i][j] = new ChessPiece(piece.getType(), piece.isWhite());
            }
        }

        // bottom of the board
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
