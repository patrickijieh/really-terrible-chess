class ChessPieceInfo {
    private readonly type_: PieceType;
    private readonly isWhite_: boolean;
    private readonly pos_: string;
    constructor(rank: PieceType, isWhite: boolean, pos: string) {
        this.isWhite_ = isWhite;
        this.type_ = rank;
        this.pos_ = pos;
    }

    get type() {
        return this.type_;
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
    type: PieceType;
    isWhite: boolean;
    pos: string;
    constructor(type: PieceType, isWhite: boolean, pos: string) {
        this.type = type;
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

export { ChessPieceInfo, PieceType, ChessPieceProps, ChessBoardProps, ChessSquareProps };
