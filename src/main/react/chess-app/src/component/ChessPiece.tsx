import { PieceRank } from "../types.ts"

import whiteRook from "../chess-pieces/white-rook.png";
import blackRook from "../chess-pieces/black-rook.png";
import whiteQueen from "../chess-pieces/white-knight.png";
import blackQueen from "../chess-pieces/black-queen.png";
import whiteKing from "../chess-pieces/white-king.png";
import blackKing from "../chess-pieces/black-king.png";
import whiteBishop from "../chess-pieces/white-bishop.png";
import blackBishop from "../chess-pieces/black-bishop.png";
import whiteKnight from "../chess-pieces/white-knight.png";
import blackKnight from "../chess-pieces/black-knight.png";
import whitePawn from "../chess-pieces/white-pawn.png";
import blackPawn from "../chess-pieces/black-pawn.png";



interface ChessPieceProps {
    rank: PieceRank;
    isWhite: boolean;
    pos: string;
}

const ChessPiece = (props: ChessPieceProps) => {

    let imgSrc: string;

    switch (props.rank) {
        case PieceRank.ROOK:
            imgSrc = props.isWhite ? whiteRook : blackRook;
            break;
        case PieceRank.QUEEN:
            imgSrc = props.isWhite ? whiteQueen : blackQueen;
            break;
        case PieceRank.KING:
            imgSrc = props.isWhite ? whiteKing : blackKing;
            break;
        case PieceRank.BISHOP:
            imgSrc = props.isWhite ? whiteBishop : blackBishop;
            break;
        case PieceRank.KNIGHT:
            imgSrc = props.isWhite ? whiteKnight : blackKnight;
            break;
        case PieceRank.PAWN:
            imgSrc = props.isWhite ? whitePawn : blackPawn;
            break;
    }


    return (
        <>
            <img src={imgSrc}
                alt={"" + (props.isWhite ? "WHITE " : "BLACK ") + props.rank}
            />
        </>
    )
}

export default ChessPiece;
