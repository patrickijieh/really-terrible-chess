import { PieceType, ChessPieceProps } from "./types.ts"

import whiteRook from "./chess-pieces/white-rook.png";
import blackRook from "./chess-pieces/black-rook.png";
import whiteQueen from "./chess-pieces/white-queen.png";
import blackQueen from "./chess-pieces/black-queen.png";
import whiteKing from "./chess-pieces/white-king.png";
import blackKing from "./chess-pieces/black-king.png";
import whiteBishop from "./chess-pieces/white-bishop.png";
import blackBishop from "./chess-pieces/black-bishop.png";
import whiteKnight from "./chess-pieces/white-knight.png";
import blackKnight from "./chess-pieces/black-knight.png";
import whitePawn from "./chess-pieces/white-pawn.png";
import blackPawn from "./chess-pieces/black-pawn.png";

const ChessPiece = ({ rank, isWhite }: ChessPieceProps) => {

    let imgSrc: string;

    switch (rank) {
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
                alt={`${isWhite ? "WHITE" : "BLACK"} ${rank}`}
                draggable={true}
            />
        </>
    )
}

export default ChessPiece;
