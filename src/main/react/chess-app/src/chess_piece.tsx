import { ChessPieceType, ChessPiece } from "./types.ts"

import white_rook from "./chess-pieces/white-rook.png";
import black_rook from "./chess-pieces/black-rook.png";
import white_queen from "./chess-pieces/white-queen.png";
import black_queen from "./chess-pieces/black-queen.png";
import white_king from "./chess-pieces/white-king.png";
import black_king from "./chess-pieces/black-king.png";
import white_bishop from "./chess-pieces/white-bishop.png";
import black_bishop from "./chess-pieces/black-bishop.png";
import white_knight from "./chess-pieces/white-knight.png";
import black_knight from "./chess-pieces/black-knight.png";
import white_pawn from "./chess-pieces/white-pawn.png";
import black_pawn from "./chess-pieces/black-pawn.png";



interface ChessPieceProps {
    type: ChessPieceType;
    isWhite: boolean;
    pos: string;
}

const ChessPieceComponent = (props: ChessPieceProps) => {

    let img_src: string;

    switch (props.type) {
        case ChessPieceType.ROOK:
            img_src = props.isWhite ? white_rook : black_rook;
            break;
        case ChessPieceType.QUEEN:
            img_src = props.isWhite ? white_queen : black_queen;
            break;
        case ChessPieceType.KING:
            img_src = props.isWhite ? white_king : black_king;
            break;
        case ChessPieceType.BISHOP:
            img_src = props.isWhite ? white_bishop : black_bishop;
            break;
        case ChessPieceType.KNIGHT:
            img_src = props.isWhite ? white_knight : black_knight;
            break;
        case ChessPieceType.PAWN:
            img_src = props.isWhite ? white_pawn : black_pawn;
            break;
    }


    return (
        <>
            <img src={img_src}
                alt={"" + (props.isWhite ? "WHITE " : "BLACK ") + props.type}
            />
        </>
    )
}

export default ChessPieceComponent;
