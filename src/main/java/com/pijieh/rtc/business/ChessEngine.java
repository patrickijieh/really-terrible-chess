package com.pijieh.rtc.business;

import com.pijieh.rtc.business.models.ChessPiece;
import com.pijieh.rtc.business.models.MoveState;
import com.pijieh.rtc.business.models.ChessGame.GameState;
import com.pijieh.rtc.business.models.ChessPiece.PieceType;

import lombok.Value;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class ChessEngine {
    int boardSize;
    ChessPiece[][] defaultBoard;

    public ChessEngine(String defaultBoardStr, int boardSize) {
        this.boardSize = boardSize;
        defaultBoard = parseBoard(defaultBoardStr);
    }

    public boolean checkIfValidMove(String moveStr, GameState gameState, boolean isPlayerWhite,
            boolean isWhitesTurn) {
        if (gameState != GameState.NORMAL && gameState != GameState.CHECK) {
            return false;
        }

        if (isPlayerWhite != isWhitesTurn) {
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

        if ((moveStr.charAt(0) == 'w' && !isPlayerWhite)
                || (moveStr.charAt(0) == 'b' && isPlayerWhite)) {
            return false;
        }

        return true;
    }

    public MoveState makeMove(ChessPiece[][] board, String moveStr, GameState currentState) {
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
            return new MoveState(false, currentState);
        }

        if (newPos.getRow() == oldPos.getRow() && newPos.getCol() == oldPos.getCol()) {
            return new MoveState(false, currentState);
        }

        boolean validMove = validateMove(board, type, pieceIsWhite, isCapture, oldPos.getRow(),
                oldPos.getCol(), newPos.getRow(), newPos.getCol());

        if (!validMove) {
            return new MoveState(false, currentState);
        }

        ChessPiece movingPiece = board[oldPos.getRow()][oldPos.getCol()];
        ChessPiece potentialPiece = board[newPos.getRow()][newPos.getCol()];
        board[oldPos.getRow()][oldPos.getCol()] = null;
        board[newPos.getRow()][newPos.getCol()] = movingPiece;

        GameState newState = GameState.NORMAL;

        if (potentialPiece != null && isCheckMate(potentialPiece)) {
            newState = GameState.FINISHED;
            log.info("checkmate!! {} king has been captured", potentialPiece.isWhite() ? "white" : "black");
        }

        if (gameIsInCheck(board)) {
            newState = GameState.CHECK;
            log.info("game is in check");
        }

        debugBoard(board);

        return new MoveState(true, newState);
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

    private boolean validateBishopMove(ChessPiece[][] board, int row, int col, int newRow,
            int newCol) {
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

    private boolean validateRookMove(ChessPiece[][] board, int row, int col, int newRow,
            int newCol) {
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

    private boolean validateQueenMove(ChessPiece[][] board, int row, int col, int newRow,
            int newCol) {
        return validateBishopMove(board, row, col, newRow, newCol)
                || validateRookMove(board, row, col, newRow, newCol);
    }

    private boolean validateKingMove(ChessPiece[][] board, int row, int col, int newRow,
            int newCol) {
        return Math.abs(row - newRow) <= 1 && Math.abs(col - newCol) <= 1;
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
                } else if (board[newRow][newCol] == null && newRow - row == 2 && row == 1) {
                    return true;
                }
            } else if (!pieceIsWhite && col == newCol) {
                if (row - newRow == 1) {
                    return true;
                } else if (board[newRow][newCol] == null && row - newRow == 2 && row == boardSize - 2) {
                    return true;
                }
            }
        }
        return false;
    }

    public boolean isCheckMate(ChessPiece potentialKing) {
        return potentialKing.getType() == PieceType.KING;
    }

    public boolean gameIsInCheck(ChessPiece[][] board) {
        BoardPosition whiteKing = null;
        BoardPosition blackKing = null;
        for (int row = 0; row < boardSize; row++) {
            for (int col = 0; col < boardSize; col++) {
                if (board[row][col] != null && board[row][col].getType() == PieceType.KING) {
                    if (board[row][col].isWhite()) {
                        whiteKing = new BoardPosition(row, col);
                    } else {
                        blackKing = new BoardPosition(row, col);
                    }
                }
            }
        }

        if (kingCanBeTaken(board, whiteKing, true)) {
            return true;
        }

        if (kingCanBeTaken(board, blackKing, false)) {
            return true;
        }

        return false;
    }

    private boolean kingCanBeTaken(ChessPiece[][] board, BoardPosition kingPos, boolean kingIsWhite) {
        int kingRow = kingPos.getRow();
        int kingCol = kingPos.getCol();
        boolean north = true;
        boolean south = true;
        boolean east = true;
        boolean west = true;
        boolean northeast = true;
        boolean northwest = true;
        boolean southeast = true;
        boolean southwest = true;

        // check cardinals
        for (int i = 1; i < boardSize && (north || south || east || west); i++) {
            if (kingRow + i >= boardSize) {
                north = false;
            }
            if (kingRow - i < 0) {
                south = false;
            }
            if (kingCol + i >= boardSize) {
                east = false;
            }
            if (kingCol - i < 0) {
                west = false;
            }

            if (north && board[kingRow + i][kingCol] != null) {
                if (board[kingRow + i][kingCol].isWhite() != kingIsWhite) {
                    if (validateCardinalMovesCanCapture(board, kingRow + i, kingCol, kingRow, kingCol)) {
                        return true;
                    }
                }
                north = false;
            }
            if (south && board[kingRow - i][kingCol] != null) {
                if (board[kingRow - i][kingCol].isWhite() != kingIsWhite) {
                    if (validateCardinalMovesCanCapture(board, kingRow - i, kingCol, kingRow, kingCol)) {
                        return true;
                    }
                }
                south = false;
            }
            if (east && board[kingRow][kingCol + i] != null) {
                if (board[kingRow][kingCol + i].isWhite() != kingIsWhite) {
                    if (validateCardinalMovesCanCapture(board, kingRow, kingCol + i, kingRow, kingCol)) {
                        return true;
                    }
                }
                east = false;
            }
            if (west && board[kingRow][kingCol - i] != null) {
                if (board[kingRow][kingCol - i].isWhite() != kingIsWhite) {
                    if (validateCardinalMovesCanCapture(board, kingRow, kingCol - i, kingRow, kingCol)) {
                        return true;
                    }
                }
                west = false;
            }
        }

        // check diags
        for (int i = 1; i < boardSize && (northeast || northwest || southeast || southwest); i++) {
            if (kingRow + i >= boardSize || kingCol + i >= boardSize) {
                northeast = false;
            }
            if (kingRow + i >= boardSize || kingCol - i < 0) {
                northwest = false;
            }
            if (kingRow - i < 0 || kingCol + i >= boardSize) {
                southeast = false;
            }
            if (kingRow - i < 0 || kingCol - i < 0) {
                southwest = false;
            }

            if (northeast && board[kingRow + i][kingCol + i] != null) {
                if (board[kingRow + i][kingCol + i].isWhite() != kingIsWhite) {
                    if (validateDiagonalMovesCanCapture(board, kingRow + i, kingCol + i, kingRow, kingCol)) {
                        return true;
                    }
                }
                northeast = false;
            }
            if (northwest && board[kingRow + i][kingCol - i] != null) {
                if (board[kingRow + i][kingCol - i].isWhite() != kingIsWhite) {
                    if (validateDiagonalMovesCanCapture(board, kingRow + i, kingCol - i, kingRow, kingCol)) {
                        return true;
                    }
                }
                northwest = false;
            }
            if (southeast && board[kingRow - i][kingCol + i] != null) {
                if (board[kingRow - i][kingCol + i].isWhite() != kingIsWhite) {
                    if (validateDiagonalMovesCanCapture(board, kingRow - i, kingCol + i, kingRow, kingCol)) {
                        return true;
                    }
                }
                southeast = false;
            }
            if (southwest && board[kingRow - i][kingCol - i] != null) {
                if (board[kingRow - i][kingCol - i].isWhite() != kingIsWhite) {
                    if (validateDiagonalMovesCanCapture(board, kingRow - i, kingCol - i, kingRow, kingCol)) {
                        return true;
                    }
                }
                southwest = false;
            }
        }

        // check for knights
        // blegh
        ChessPiece currentPiece;
        if (kingRow - 1 >= 0) {
            if (kingCol - 2 >= 0) {
                currentPiece = board[kingRow - 1][kingCol - 2];
                if (currentPiece != null && currentPiece.getType() == PieceType.KNIGHT
                        && currentPiece.isWhite() != kingIsWhite) {
                    return true;
                }
            }
            if (kingCol + 2 < boardSize) {
                currentPiece = board[kingRow - 1][kingCol + 2];
                if (currentPiece != null && currentPiece.getType() == PieceType.KNIGHT
                        && currentPiece.isWhite() != kingIsWhite) {
                    return true;
                }
            }
        }
        if (kingRow + 1 < boardSize) {
            if (kingCol - 2 >= 0) {
                currentPiece = board[kingRow + 1][kingCol - 2];
                if (currentPiece != null && currentPiece.getType() == PieceType.KNIGHT
                        && currentPiece.isWhite() != kingIsWhite) {
                    return true;
                }
            }
            if (kingCol + 2 < boardSize) {
                currentPiece = board[kingRow + 1][kingCol + 2];
                if (currentPiece != null && currentPiece.getType() == PieceType.KNIGHT
                        && currentPiece.isWhite() != kingIsWhite) {
                    return true;
                }
            }
        }
        if (kingRow - 2 >= 0) {
            if (kingCol - 1 >= 0) {
                currentPiece = board[kingRow - 2][kingCol - 1];
                if (currentPiece != null && currentPiece.getType() == PieceType.KNIGHT
                        && currentPiece.isWhite() != kingIsWhite) {
                    return true;
                }
            }
            if (kingCol + 1 < boardSize) {
                currentPiece = board[kingRow - 2][kingCol + 1];
                if (currentPiece != null && currentPiece.getType() == PieceType.KNIGHT
                        && currentPiece.isWhite() != kingIsWhite) {
                    return true;
                }
            }
        }
        if (kingRow + 2 < boardSize) {
            if (kingCol - 1 >= 0) {
                currentPiece = board[kingRow + 2][kingCol - 1];
                if (currentPiece != null && currentPiece.getType() == PieceType.KNIGHT
                        && currentPiece.isWhite() != kingIsWhite) {
                    return true;
                }
            }
            if (kingCol + 1 < boardSize) {
                currentPiece = board[kingRow + 2][kingCol + 1];
                if (currentPiece != null && currentPiece.getType() == PieceType.KNIGHT
                        && currentPiece.isWhite() != kingIsWhite) {
                    return true;
                }
            }
        }

        return false;
    }

    boolean validateCardinalMovesCanCapture(ChessPiece[][] board, int row, int col, int kingRow, int kingCol) {
        return switch (board[row][col].getType()) {
            case ROOK -> validateRookMove(board, row, col, kingRow, kingCol);
            case QUEEN -> validateQueenMove(board, row, col, kingRow, kingCol);
            case KING -> validateKingMove(board, row, col, kingRow, kingCol);
            default -> false;
        };
    }

    boolean validateDiagonalMovesCanCapture(ChessPiece[][] board, int row, int col, int kingRow, int kingCol) {
        return switch (board[row][col].getType()) {
            case PAWN -> validatePawnMove(board, row, col, kingRow, kingCol, board[row][col].isWhite(), true);
            case BISHOP -> validateBishopMove(board, row, col, kingRow, kingCol);
            case QUEEN -> validateQueenMove(board, row, col, kingRow, kingCol);
            case KING -> validateKingMove(board, row, col, kingRow, kingCol);
            default -> false;
        };
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
        for (ChessPiece[] row : board) {
            for (ChessPiece piece : row) {
                if (piece == null) {
                    sb.append("_ ");
                } else {
                    String pieceStr = piece.toString();
                    if (piece.isWhite()) {
                        pieceStr = pieceStr.toLowerCase();
                    }
                    sb.append(pieceStr + " ");
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
