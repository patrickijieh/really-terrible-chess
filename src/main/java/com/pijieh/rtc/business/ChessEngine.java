package com.pijieh.rtc.business;

import com.pijieh.rtc.business.models.ChessPiece;
import com.pijieh.rtc.business.models.MoveState;
import com.pijieh.rtc.business.models.ChessGame.GameState;
import com.pijieh.rtc.business.models.ChessPiece.PieceType;

import lombok.Value;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class ChessEngine {
    @Value
    class BoardPosition {
        int row;
        int col;
    };

    enum Castle {
        NONE,
        KINGSIDE,
        QUEENSIDE
    };

    final static String PROMOTION_REGEX = "\\([N,R,B,Q]\\)";
    final static int MAX_MOVE_COMMAND_LENGTH = 11;

    int boardSize;
    ChessPiece[][] defaultBoard;

    public ChessEngine(String defaultBoardStr, int boardSize) {
        this.boardSize = boardSize;
        defaultBoard = parseBoard(defaultBoardStr);
    }

    public boolean checkIfValidMove(String moveStr, GameState gameState, boolean isPlayerWhite,
            boolean isWhitesTurn) {
        if (gameState != GameState.NORMAL && gameState != GameState.CHECK_WHITE
                && gameState != GameState.CHECK_BLACK
                && gameState != GameState.CHECK_BOTH) {
            return false;
        }

        if (isPlayerWhite != isWhitesTurn) {
            return false;
        }

        if (moveStr.length() < 4 || moveStr.length() > MAX_MOVE_COMMAND_LENGTH) {
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
        PieceType typ = parsePieceType(moveStr);
        Castle castleTyp = parseCastle(moveStr);
        boolean castling = castleTyp != Castle.NONE;
        PieceType promotionTyp = parsePromotion(moveStr);
        boolean pieceIsWhite = moveStr.charAt(0) == 'w';

        MoveState moveState;
        if (castling) {
            moveState = makeCastleMove(board, pieceIsWhite, castleTyp, currentState);
        } else if (promotionTyp != PieceType.NONE) {
            moveState = makePromotionMove(board, moveStr, typ, promotionTyp, pieceIsWhite, currentState);
        } else {
            moveState = makeRegularMove(board, moveStr, typ, pieceIsWhite, currentState);
        }

        if (moveState.getGameState() == GameState.FINISHED) {
            log.info("checkmate!! {} king has been captured", pieceIsWhite ? "black" : "white");
        } else if (moveState.getGameState() == GameState.CHECK_WHITE
                || moveState.getGameState() == GameState.CHECK_BLACK
                || moveState.getGameState() == GameState.CHECK_BOTH) {
            log.info("game is in check");
        }

        debugBoard(board);
        return moveState;
    }

    public ChessPiece[][] getDefaultBoard() {
        final ChessPiece[][] newBoard = new ChessPiece[boardSize][boardSize];

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

    private MoveState makeCastleMove(ChessPiece[][] board, boolean isWhite, Castle castleTyp, GameState currentState) {
        if (!validateCastle(board, isWhite, castleTyp)) {
            return new MoveState(false, currentState);
        }

        if (isWhite) {
            ChessPiece king = board[0][4];
            int rookCol = (castleTyp == Castle.KINGSIDE ? boardSize - 1 : 0);
            ChessPiece rook = board[0][rookCol];
            int newKingCol = (castleTyp == Castle.KINGSIDE ? 6 : 2);
            int newRookRelativePos = (castleTyp == Castle.KINGSIDE ? -1 : 1);
            board[0][4] = null;
            board[0][rookCol] = null;
            board[0][newKingCol] = king;
            board[0][newKingCol + newRookRelativePos] = rook;
        } else {
            ChessPiece king = board[boardSize - 1][4];
            int rookCol = (castleTyp == Castle.KINGSIDE ? boardSize - 1 : 0);
            ChessPiece rook = board[boardSize - 1][rookCol];
            int newKingCol = (castleTyp == Castle.KINGSIDE ? 6 : 2);
            int newRookRelativePos = (castleTyp == Castle.KINGSIDE ? -1 : 1);
            board[boardSize - 1][4] = null;
            board[boardSize - 1][rookCol] = null;
            board[boardSize - 1][newKingCol] = king;
            board[boardSize - 1][newKingCol + newRookRelativePos] = rook;
        }

        GameState newState = getGameState(board, null);
        return new MoveState(true, newState);
    }

    private MoveState makePromotionMove(ChessPiece[][] board, String moveStr, PieceType typ,
            PieceType promotionTyp, boolean pieceIsWhite, GameState currentState) {
        boolean isCapture = moveStr.contains("x");
        BoardPosition oldPos;
        BoardPosition newPos;

        if (typ == PieceType.PAWN) {
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

        if (newPos.getRow() == oldPos.getRow() && newPos.getCol() == oldPos.getCol()) {
            return new MoveState(false, currentState);
        }

        if (!validatePiecePromotion(board, oldPos.getRow(), oldPos.getCol(), newPos.getRow(),
                newPos.getCol(), pieceIsWhite, promotionTyp)) {
            return new MoveState(false, currentState);
        }

        if (!validateMove(board, typ, pieceIsWhite, isCapture, oldPos.getRow(), oldPos.getCol(),
                newPos.getRow(), newPos.getCol())) {
            return new MoveState(false, currentState);
        }

        ChessPiece potentialPiece = board[newPos.getRow()][newPos.getCol()];
        board[oldPos.getRow()][oldPos.getCol()] = null;
        board[newPos.getRow()][newPos.getCol()] = new ChessPiece(promotionTyp, pieceIsWhite);

        GameState newState = getGameState(board, potentialPiece);
        return new MoveState(true, newState);
    }

    private MoveState makeRegularMove(ChessPiece[][] board, String moveStr, PieceType typ, boolean pieceIsWhite,
            GameState currentState) {
        boolean isCapture = moveStr.contains("x");
        BoardPosition oldPos;
        BoardPosition newPos;

        if (typ == PieceType.PAWN) {
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

        if (newPos.getRow() == oldPos.getRow() && newPos.getCol() == oldPos.getCol()) {
            return new MoveState(false, currentState);
        }

        if (!validateMove(board, typ, pieceIsWhite, isCapture, oldPos.getRow(),
                oldPos.getCol(), newPos.getRow(), newPos.getCol())) {
            return new MoveState(false, currentState);
        }

        ChessPiece movingPiece = board[oldPos.getRow()][oldPos.getCol()];
        ChessPiece potentialPiece = board[newPos.getRow()][newPos.getCol()];
        board[oldPos.getRow()][oldPos.getCol()] = null;
        board[newPos.getRow()][newPos.getCol()] = movingPiece;

        GameState newState = getGameState(board, potentialPiece);
        return new MoveState(true, newState);
    }

    private Castle parseCastle(String moveStr) {
        if (moveStr.equals("wO-O") || moveStr.equals("bO-O")) {
            return Castle.KINGSIDE;
        } else if (moveStr.equals("wO-O-O") || moveStr.equals("bO-O-O")) {
            return Castle.QUEENSIDE;
        }

        return Castle.NONE;
    }

    private PieceType parsePromotion(String moveStr) {
        String promotingStr = moveStr.substring(moveStr.length() - 3);
        if (!promotingStr.matches(PROMOTION_REGEX)) {
            return PieceType.NONE;
        }

        return parsePieceType(promotingStr);
    }

    private PieceType parsePieceType(String moveStr) {
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

    private boolean validateMove(ChessPiece[][] board, PieceType type, boolean pieceIsWhite,
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

        if (potentialPiece != null && potentialPiece.isWhite() == pieceIsWhite) {
            return false;
        }

        return switch (piece.getType()) {
            case KNIGHT -> validateKnightMove(row, col, newRow, newCol);
            case BISHOP -> validateBishopMove(board, row, col, newRow, newCol);
            case ROOK -> validateRookMove(board, row, col, newRow, newCol);
            case QUEEN -> validateQueenMove(board, row, col, newRow, newCol);
            case KING -> validateKingMove(board, row, col, newRow, newCol);
            default -> validatePawnMove(board, row, col, newRow, newCol, pieceIsWhite, isCapture);
        };
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

    private boolean validatePiecePromotion(ChessPiece[][] board, int row, int col, int newRow,
            int newCol, boolean pieceIsWhite, PieceType newTyp) {
        assert row < 8 && row >= 0;
        assert col < 8 && col >= 0;
        assert newRow < 8 && newRow >= 0;
        assert newCol < 8 && newCol >= 0;
        if ((pieceIsWhite && newRow != boardSize - 1) || (!pieceIsWhite && newRow != 0)) {
            return false;
        }

        PieceType typ = board[row][col].getType();
        if (typ == PieceType.KING || typ == PieceType.QUEEN) {
            return false;
        }

        if (newTyp.compareTo(typ) < 0) {
            return false;
        }

        return true;
    }

    private boolean validateCastle(ChessPiece[][] board, boolean isWhite, Castle castleTyp) {
        if (isWhite) {
            ChessPiece wKing = board[0][4];
            int rookCol = (castleTyp == Castle.KINGSIDE ? boardSize - 1 : 0);
            ChessPiece rook = board[0][rookCol];
            int newKingCol = (castleTyp == Castle.KINGSIDE ? 6 : 2);
            int newRookRelativePos = (castleTyp == Castle.KINGSIDE ? -1 : 1);
            if (wKing == null || wKing.getType() != PieceType.KING || rook == null
                    || rook.getType() != PieceType.ROOK) {
                return false;
            }
            // treat king as a rook (cause why not)
            return validateRookMove(board, 0, 4, 0, newKingCol)
                    && validateRookMove(board, 0, rookCol, 0, newKingCol + newRookRelativePos);
        } else {
            ChessPiece bKing = board[boardSize - 1][4];
            int rookCol = (castleTyp == Castle.KINGSIDE ? boardSize - 1 : 0);
            ChessPiece rook = board[boardSize - 1][rookCol];
            int newKingCol = (castleTyp == Castle.KINGSIDE ? 6 : 2);
            int newRookRelativePos = (castleTyp == Castle.KINGSIDE ? -1 : 1);
            if (bKing == null || bKing.getType() != PieceType.KING || rook == null
                    || rook.getType() != PieceType.ROOK) {
                return false;
            }

            return validateRookMove(board, boardSize - 1, 4, boardSize - 1, newKingCol)
                    && validateRookMove(board, boardSize - 1, rookCol, boardSize - 1, newKingCol + newRookRelativePos);
        }
    }

    private GameState getGameState(ChessPiece[][] board, ChessPiece removedPiece) {
        if (removedPiece != null && removedPiece.getType() == PieceType.KING) {
            return GameState.FINISHED;
        }

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

        final boolean whiteCanBeTaken = kingCanBeTaken(board, whiteKing, true);
        final boolean blackCanBeTaken = kingCanBeTaken(board, blackKing, false);
        if (whiteCanBeTaken && blackCanBeTaken) {
            return GameState.CHECK_BOTH;
        } else if (whiteCanBeTaken) {
            return GameState.CHECK_WHITE;
        } else if (blackCanBeTaken) {
            return GameState.CHECK_BLACK;
        }

        return GameState.NORMAL;
    }

    private boolean kingCanBeTaken(ChessPiece[][] board, BoardPosition kingPos, boolean kingIsWhite) {
        final int kingRow = kingPos.getRow();
        final int kingCol = kingPos.getCol();
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

    private boolean validateCardinalMovesCanCapture(ChessPiece[][] board, int row, int col, int kingRow, int kingCol) {
        return switch (board[row][col].getType()) {
            case ROOK -> validateRookMove(board, row, col, kingRow, kingCol);
            case QUEEN -> validateQueenMove(board, row, col, kingRow, kingCol);
            case KING -> validateKingMove(board, row, col, kingRow, kingCol);
            default -> false;
        };
    }

    private boolean validateDiagonalMovesCanCapture(ChessPiece[][] board, int row, int col, int kingRow, int kingCol) {
        return switch (board[row][col].getType()) {
            case PAWN -> validatePawnMove(board, row, col, kingRow, kingCol, board[row][col].isWhite(), true);
            case BISHOP -> validateBishopMove(board, row, col, kingRow, kingCol);
            case QUEEN -> validateQueenMove(board, row, col, kingRow, kingCol);
            case KING -> validateKingMove(board, row, col, kingRow, kingCol);
            default -> false;
        };
    }

    private ChessPiece[][] parseBoard(String boardStr) {
        final ChessPiece[][] board = new ChessPiece[boardSize][boardSize];

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
