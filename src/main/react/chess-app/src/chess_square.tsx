import { ChessPieceType, ChessPiece } from "./types.ts";

import ChessPieceComponent from "./chess_piece.tsx";

interface ChessSquareProps {
    chessPieceProps?: ChessPieceProps;
    handlePieceMoveStart?: Function;
    handlePieceMoveEnd?: Function;
    isWhiteSquare: boolean;
}

interface ChessPieceProps {
    type: ChessPieceType;
    isWhite: boolean;
    pos: string;
}

const ChessSquare = (props: ChessSquareProps) => {

    let squareClass = "cell " + (props.isWhiteSquare ? "cell-white" : "cell-black");
    if (props.chessPieceProps === undefined) {
        return (
            <div
                className={squareClass}
                onDragEnd={(event) => { }}
                onDragOver={(event) => { }}
            >
            </div>
        )
    }

    return (
        <div
            onDragStart={(event) => props.handlePieceMoveStart!(event, props.chessPieceProps!.type, props.chessPieceProps!.pos)}
            onDragEnd={(event) => { props.handlePieceMoveEnd!() }}
            onDragOver={(event) => { }}
            onClick={(event) => console.log((event.target as HTMLImageElement).parentNode)}
            className={squareClass}
        >
            <ChessPieceComponent
                type={props.chessPieceProps.type}
                isWhite={props.chessPieceProps.isWhite}
                pos={props.chessPieceProps.pos}
            />
        </div>
    )
}

export default ChessSquare;
