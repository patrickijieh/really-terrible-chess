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
    isPlayerWhite: boolean;
    sendMove: Function

    constructor(board: string, isWhite: boolean, sendMove: Function) {
        this.board = board;
        this.isPlayerWhite = isWhite;
        this.sendMove = sendMove;
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
    handleDrop?: Function;
    handlePieceMoveEnd?: Function;
    isWhiteSquare: boolean;
    row: number;
    col: number;

    constructor(isWhiteSquare: boolean, row: number, col: number, pieceProps?: ChessPieceProps, moveStart?: Function,
        moveEnd?: Function, moveDrop?: Function) {
        this.isWhiteSquare = isWhiteSquare;
        this.row = row;
        this.col = col;

        if (pieceProps) {
            this.chessPieceProps = pieceProps;
        }
        if (moveStart) {
            this.handlePieceMoveStart = moveStart;
        }
        if (moveEnd) {
            this.handlePieceMoveEnd = moveEnd;
        }
        if (moveDrop) {
            this.handleDrop = moveDrop;
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
