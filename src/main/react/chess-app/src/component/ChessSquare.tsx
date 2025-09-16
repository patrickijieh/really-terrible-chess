import { ChessSquareProps } from "../types.ts";
import ChessPiece from "./ChessPiece";
import "../styles.css";


const ChessSquare = (props: ChessSquareProps) => {

    let squareClass = "cell " + (props.isWhiteSquare ? "cell-white" : "cell-black");
    if (props.chessPieceProps === undefined) {
        return (
            <div
                className={squareClass}
                onMouseUp={(event) => { props.handlePieceMoveEnd!(event) }}
            >
            </div>
        )
    }

    return (
        <div
            onMouseDown={(event) => props.handlePieceMoveStart!(event,
                props.chessPieceProps!.rank, props.chessPieceProps!.pos, props.chessPieceProps!.isWhite)}
            onMouseUp={(event) => { props.handlePieceMoveEnd!(event) }}
            className={squareClass}
        >
            <ChessPiece
                rank={props.chessPieceProps.rank}
                isWhite={props.chessPieceProps.isWhite}
                pos={props.chessPieceProps.pos}
            />
        </div>
    )
}

export default ChessSquare;
