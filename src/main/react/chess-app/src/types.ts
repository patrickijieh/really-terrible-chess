type GameInfo = {
    gameId: string
};

class ChessPieceInfo {
    private readonly rank_: PieceType;
    private readonly isWhite_: boolean;
    private readonly pos_: string;
    constructor(rank: PieceType, isWhite: boolean, pos: string) {
        this.isWhite_ = isWhite;
        this.rank_ = rank;
        this.pos_ = pos;
    }

    get rank() {
        return this.rank_;
    }

    get isWhite() {
        return this.isWhite_;
    }

    get pos() {
        return this.pos_;
    }
}

class ChessBoardProps {
    board: string

    constructor(board: string) {
        this.board = board;
    }
}

class ChessPieceProps {
    rank: PieceType;
    isWhite: boolean;
    pos: string;
    constructor(rank: PieceType, isWhite: boolean, pos: string) {
        this.rank = rank;
        this.isWhite = isWhite;
        this.pos = pos;
    }
}

class ChessSquareProps {
    chessPieceProps?: ChessPieceProps;
    handlePieceMoveStart?: Function;
    handlePieceMoveEnd?: Function;
    isWhiteSquare: boolean;

    constructor(isWhiteSquare: boolean, pieceProps?: ChessPieceProps, moveStart?: Function,
        moveEnd?: Function) {
        this.isWhiteSquare = isWhiteSquare;
        if (pieceProps) {
            this.chessPieceProps = pieceProps;
        }
        if (moveStart) {
            this.handlePieceMoveStart = moveStart;
        }
        if (moveEnd) {
            this.handlePieceMoveEnd = moveEnd;
        }
    }
}

enum PieceType {
    PAWN = "PAWN",
    KNIGHT = "KNIGHT",
    BISHOP = "BISHOP",
    ROOK = "ROOK",
    QUEEN = "QUEEN",
    KING = "KING"
}

export type { GameInfo };
export { ChessPieceInfo, PieceType, ChessPieceProps, ChessBoardProps, ChessSquareProps };
