type GameInfo = {
    gameId: string
};

class ChessPieceType {
    private readonly rank_: PieceRank;
    private readonly isWhite_: boolean;
    private readonly pos_: string;
    constructor(rank: PieceRank, isWhite: boolean, pos: string) {
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
    rank: PieceRank;
    isWhite: boolean;
    pos: string;
    constructor(rank: PieceRank, isWhite: boolean, pos: string) {
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

    constructor(isWhiteSquare: boolean, pieceProps?: ChessPieceProps, moveStart?: Function, moveEnd?: Function) {
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

enum PieceRank {
    PAWN = "PAWN",
    KNIGHT = "KNIGHT",
    BISHOP = "BISHOP",
    ROOK = "ROOK",
    QUEEN = "QUEEN",
    KING = "KING"
}

export type { GameInfo };
export { ChessPieceType, PieceRank, ChessPieceProps, ChessBoardProps, ChessSquareProps };
