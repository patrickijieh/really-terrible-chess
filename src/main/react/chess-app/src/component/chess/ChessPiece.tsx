import { PieceType, ChessPieceProps } from "./types.ts"

import whiteRook from "../../img/chess-pieces/white-rook.png";
import blackRook from "../../img/chess-pieces/black-rook.png";
import whiteQueen from "../../img/chess-pieces/white-queen.png";
import blackQueen from "../../img/chess-pieces/black-queen.png";
import whiteKing from "../../img/chess-pieces/white-king.png";
import blackKing from "../../img/chess-pieces/black-king.png";
import whiteBishop from "../../img/chess-pieces/white-bishop.png";
import blackBishop from "../../img/chess-pieces/black-bishop.png";
import whiteKnight from "../../img/chess-pieces/white-knight.png";
import blackKnight from "../../img/chess-pieces/black-knight.png";
import whitePawn from "../../img/chess-pieces/white-pawn.png";
import blackPawn from "../../img/chess-pieces/black-pawn.png";

const ChessPiece = ({ type, isWhite, draggable }: ChessPieceProps) => {
    let imgSrc: string;

    switch (type) {
        case PieceType.ROOK:
            imgSrc = isWhite ? whiteRook : blackRook;
            break;
        case PieceType.QUEEN:
            imgSrc = isWhite ? whiteQueen : blackQueen;
            break;
        case PieceType.KING:
            imgSrc = isWhite ? whiteKing : blackKing;
            break;
        case PieceType.BISHOP:
            imgSrc = isWhite ? whiteBishop : blackBishop;
            break;
        case PieceType.KNIGHT:
            imgSrc = isWhite ? whiteKnight : blackKnight;
            break;
        case PieceType.PAWN:
            imgSrc = isWhite ? whitePawn : blackPawn;
            break;
    }
    return (
        <>
            <img src={imgSrc}
                alt={`${isWhite ? "WHITE" : "BLACK"} ${type}`}
                draggable={false}
                style={draggable ? { cursor: "grab" } : { cursor: "default" }}
                className="no-select"
                width={64}
                height={64}
                {... { "piece-type": type, "piece-color": (isWhite ? "WHITE" : "BLACK") }}
            />
        </>
    )
}

export default ChessPiece;
