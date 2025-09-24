import { ChessSquareProps } from "./types.ts";
import ChessPiece from "./ChessPiece";
import "../../styles.css";


const ChessSquare = ({ chessPieceProps, handlePieceMoveStart, handlePieceMoveEnd, isWhiteSquare }: ChessSquareProps) => {
    let squareClass = `cell ${isWhiteSquare ? "cell-white" : "cell-black"}`;
    if (chessPieceProps === undefined) {
        return (
            <div
                className={squareClass}
                onMouseUp={(event) => handlePieceMoveEnd!(event)}
            >
            </div>
        )
    }

    return (
        <div
            onMouseDown={(event) =>
                handlePieceMoveStart!(event, chessPieceProps!.type, chessPieceProps!.pos,
                    chessPieceProps!.isWhite)}
            onMouseUp={(event) => handlePieceMoveEnd!(event)}
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
