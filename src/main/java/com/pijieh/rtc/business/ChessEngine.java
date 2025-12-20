package com.pijieh.rtc.business;

import com.pijieh.rtc.business.models.ChessPiece;
import com.pijieh.rtc.business.models.ChessGame.GameState;
import com.pijieh.rtc.business.models.ChessPiece.PieceType;

import lombok.Value;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class ChessEngine {

    ChessPiece[][] defaultBoard;

    int boardSize;

    public ChessEngine(String defaultBoardStr, int boardSize) {
        this.boardSize = boardSize;
        defaultBoard = parseBoard(defaultBoardStr);
    }

    public boolean checkIfValidMove(String moveStr, GameState gameState, boolean isPlayerWhite) {
        if (gameState != GameState.NORMAL && gameState != GameState.CHECK) {
            return false;
        }

        if (moveStr.length() < 6 || moveStr.length() > 8) {
            return false;
        }

        if (!moveStr.contains(">")) {
            return false;
        }

        if (moveStr.charAt(0) != 'w' && moveStr.charAt(0) != 'b') {
            return false;
        }

        if ((moveStr.charAt(0) == 'w' && !isPlayerWhite) || (moveStr.charAt(0) == 'b' && isPlayerWhite)) {
            return false;
        }

        return true;
    }

    public boolean makeMove(ChessPiece[][] board, String moveStr) {
        PieceType type = parsePieceType(moveStr);
        boolean pieceIsWhite = moveStr.charAt(0) == 'w';
        boolean isCapture = moveStr.contains("x");
        BoardPosition oldPos;
        BoardPosition newPos;

        if (type == PieceType.PAWN) {
            oldPos = convertStringToPosition(moveStr.substring(1, 3));
            if (isCapture) {
                newPos = convertStringToPosition(moveStr.substring(5));
            } else {
                newPos = convertStringToPosition(moveStr.substring(4));
            }
        } else {
            oldPos = convertStringToPosition(moveStr.substring(2, 4));
            if (isCapture) {
                newPos = convertStringToPosition(moveStr.substring(6));
            } else {
                newPos = convertStringToPosition(moveStr.substring(5));
            }
        }

        if (newPos == null || oldPos == null) {
            return false;
        }

        boolean validMove = validateMove(board, type, pieceIsWhite, isCapture, oldPos.getRow(),
                oldPos.getCol(), newPos.getRow(), newPos.getCol());

        if (!validMove) {
            return false;
        }

        ChessPiece movingPiece = board[oldPos.getRow()][oldPos.getCol()];
        board[oldPos.getRow()][oldPos.getCol()] = null;
        board[newPos.getRow()][newPos.getCol()] = movingPiece;

        return true;
    }

    public PieceType parsePieceType(String moveStr) {
        char pieceNotation = moveStr.charAt(1);
        PieceType type = switch (pieceNotation) {
            case 'B' -> PieceType.BISHOP;
            case 'K' -> PieceType.KING;
            case 'N' -> PieceType.KNIGHT;
            case 'Q' -> PieceType.QUEEN;
            case 'R' -> PieceType.ROOK;
            default -> PieceType.PAWN;
        };

        return type;
    }

    public boolean validateMove(ChessPiece[][] board, PieceType type, boolean pieceIsWhite,
            boolean isCapture, int row, int col, int newRow, int newCol) {
        assert row < 8 && row >= 0;
        assert col < 8 && col >= 0;
        assert newRow < 8 && newRow >= 0;
        assert newCol < 8 && newCol >= 0;

        ChessPiece piece = board[row][col];
        ChessPiece potentialPiece = board[newRow][newCol];

        if (piece == null || piece.getType() != type) {
            return false;
        }

        if (potentialPiece != null) {
            if (!(potentialPiece.isWhite() ^ pieceIsWhite)) {
                return false;
            }
        }

        boolean validMove = switch (piece.getType()) {
            case KNIGHT -> validateKnightMove(row, col, newRow, newCol);
            case BISHOP -> validateBishopMove(board, row, col, newRow, newCol);
            case ROOK -> validateRookMove(board, row, col, newRow, newCol);
            case QUEEN -> validateQueenMove(board, row, col, newRow, newCol);
            case KING -> validateKingMove(board, row, col, newRow, newCol);
            default -> validatePawnMove(board, row, col, newRow, newCol, pieceIsWhite, isCapture);
        };

        if (!validMove) {
            return false;
        }

        return true;
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

    private boolean validateBishopMove(ChessPiece[][] board, int row, int col, int newRow, int newCol) {
        int rowDistance = Math.abs(row - newRow);
        int colDistance = Math.abs(col - newCol);

        if (rowDistance != colDistance || rowDistance == 0) {
            return false;
        }

        boolean directedNorth = newRow > row;
        boolean directedWest = newCol < col;
        for (int i = 1; i < rowDistance; i++) {
            if (directedNorth) {
                if (directedWest) {
                    if (board[row + i][col - i] != null) {
                        return false;
                    }
                } else {
                    if (board[row + i][col + i] != null) {
                        return false;
                    }
                }
            } else {
                if (directedWest) {
                    if (board[row - i][col - i] != null) {
                        return false;
                    }
                } else {
                    if (board[row - i][col + i] != null) {
                        return false;
                    }
                }
            }
        }

        return true;
    }

    private boolean validateRookMove(ChessPiece[][] board, int row, int col, int newRow, int newCol) {
        if (row == newRow && col != newCol) {
            boolean directedWest = newCol < col;
            int colDistance = Math.abs(col - newCol);
            for (int i = 1; i < colDistance; i++) {
                if (directedWest) {
                    if (board[row][col - i] != null) {
                        return false;
                    }
                } else {
                    if (board[row][col + i] != null) {
                        return false;
                    }
                }
            }

            return true;
        } else if (row != newRow && col == newCol) {
            boolean directedNorth = newRow > row;
            int rowDistance = Math.abs(row - newRow);
            for (int i = 1; i < rowDistance; i++) {
                if (directedNorth) {
                    if (board[row + i][col] != null) {
                        return false;
                    }
                } else {
                    if (board[row - i][col] != null) {
                        return false;
                    }
                }
            }

            return true;
        }

        return false;
    }

    private boolean validateQueenMove(ChessPiece[][] board, int row, int col, int newRow, int newCol) {
        if (validateBishopMove(board, row, col, newRow, newCol)
                || validateRookMove(board, row, col, newRow, newCol)) {
            return true;
        }

        return false;
    }

    private boolean validateKingMove(ChessPiece[][] board, int row, int col, int newRow, int newCol) {
        if (Math.abs(row - newRow) <= 1 && Math.abs(col - newCol) <= 1) {
            return true;
        }
        return false;
    }

    private boolean validatePawnMove(ChessPiece[][] board, int row, int col, int newRow, int newCol,
            boolean pieceIsWhite, boolean capture) {
        if (capture) {
            if (pieceIsWhite && newRow - row == 1 && Math.abs(col - newCol) == 1) {
                return true;
            } else if (!pieceIsWhite && row - newRow == 1 && Math.abs(col - newCol) == 1) {
                return true;
            }
        } else {
            if (pieceIsWhite && col == newCol) {
                if (newRow - row == 1) {
                    return true;
                } else if (newRow - row == 2 && row == 1) {
                    return true;
                }
            } else if (!pieceIsWhite && col == newCol) {
                if (row - newRow == 1) {
                    return true;
                } else if (row - newRow == 2 && row == boardSize - 2) {
                    return true;
                }
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
            PieceType type = switch (boardStr.charAt(i)) {
                case 'R' -> PieceType.ROOK;
                case 'N' -> PieceType.KNIGHT;
                case 'B' -> PieceType.BISHOP;
                case 'Q' -> PieceType.QUEEN;
                case 'K' -> PieceType.KING;
                default -> PieceType.PAWN;
            };

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

        int row;
        try {
            row = Integer.parseInt(pos.substring(1, 2)) - 1;
        } catch (NumberFormatException e) {
            return null;
        }
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
                    if (piece.getType() == PieceType.PAWN) {
                        whitePieces.append(convertPositionToString(i, j));
                    } else {
                        whitePieces.append(piece.toString()
                                + convertPositionToString(i, j));
                    }
                } else {
                    if (piece.getType() == PieceType.PAWN) {
                        blackPieces.append(convertPositionToString(i, j));
                    } else {
                        blackPieces.append(piece.toString()
                                + convertPositionToString(i, j));
                    }

                }
            }
        }

        return whitePieces.toString() + "|" + blackPieces.toString();
    }

    private void debugBoard(ChessPiece[][] board) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < boardSize; i++) {
            for (int j = 0; j < boardSize; j++) {
                if (board[i][j] == null) {
                    sb.append("_ ");
                } else {
                    sb.append(board[i][j].toString() + " ");
                }
            }
            log.info(sb.toString());
            sb.setLength(0);
        }
    }
}

@Value
class BoardPosition {
    int row;
    int col;
}
