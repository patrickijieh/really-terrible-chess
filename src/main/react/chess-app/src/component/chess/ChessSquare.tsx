import { ChessSquareProps } from "./types.ts";
import ChessPiece from "./ChessPiece";
import "../../styles.css";


const ChessSquare = ({ chessPieceProps, handlePieceMoveStart, handlePieceMoveEnd, handleDrop, isWhiteSquare, row, col }: ChessSquareProps) => {
    let squareClass = `cell ${isWhiteSquare ? "cell-white" : "cell-black"}`;
    if (chessPieceProps === undefined) {
        return (
            <div
                className={squareClass}
                onMouseOver={() => { handleDrop!(row, col) }}
            >
            </div>
        )
    }

    return (
        <div
            onMouseDown={(event) =>
                handlePieceMoveStart!(event, chessPieceProps!.type, chessPieceProps!.pos,
                    chessPieceProps!.isWhite)}
            onMouseUp={() => handlePieceMoveEnd!(chessPieceProps!.isWhite)}
            onMouseOver={() => { handleDrop!(row, col) }}
            className={squareClass}
        >
            <ChessPiece
                type={chessPieceProps.type}
                isWhite={chessPieceProps.isWhite}
                pos={chessPieceProps.pos}
            />
        </div>
    )
}

export default ChessSquare;
