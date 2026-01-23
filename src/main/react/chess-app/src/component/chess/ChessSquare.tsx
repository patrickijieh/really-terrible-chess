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
            className={squareClass}
            onMouseDown={(event) =>
                handlePieceMoveStart!(event, chessPieceProps!.type, row, col,
                    chessPieceProps!.isWhite)}
            onMouseUp={() => handlePieceMoveEnd!(chessPieceProps!.isWhite)}
            onMouseOver={() => { handleDrop!(row, col) }}
        >
            <ChessPiece
                {...chessPieceProps}
            />
        </div>
    )
}

export default ChessSquare;
