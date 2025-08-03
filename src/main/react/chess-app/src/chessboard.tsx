import type { JSX } from "react";
import "./styles.css";
import { ChessPiece, ChessPieceType } from "./types";

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

const startingWhite: string = "Ra1Nb1Bc1Qd1Ke1Bf1Ng1Rh1a2b2c2d2e2f2g2h2";
const startingBlack: string = "Ra8Nb8Bc8Qd8Ke8Bf8Ng8Rh8a7b7c7d7e7f7g7h7";

interface ChessBoardProps {
    board: string
}

const ChessBoard = (props: ChessBoardProps) => {

    const createChessBoard = (boardStr: string) => {
        if (boardStr.length === 0) {
            boardStr = startingWhite + "|" + startingBlack;
        }

        let pieces = parseBoard(boardStr);

        const board: JSX.Element[][] = [];
        for (let row = 8; row > 0; row--) {
            let column = [];
            for (let col = 0; col < 8; col++) {
                column.push(<></>);
            }
            board.push(column);
        }

        pieces.map(piece => {
            let row = piece.pos.charAt(1);
            let row_number = 7 - (Number.parseInt(row) - 1);
            let column_number = piece.pos.charCodeAt(0) - "a".charCodeAt(0);

            let img_src: string;
            switch (piece.type) {
                case ChessPieceType.ROOK:
                    img_src = piece.isWhite ? white_rook : black_rook;
                    break;
                case ChessPieceType.QUEEN:
                    img_src = piece.isWhite ? white_queen : black_queen;
                    break;
                case ChessPieceType.KING:
                    img_src = piece.isWhite ? white_king : black_king;
                    break;
                case ChessPieceType.BISHOP:
                    img_src = piece.isWhite ? white_bishop : black_bishop;
                    break;
                case ChessPieceType.KNIGHT:
                    img_src = piece.isWhite ? white_knight : black_knight;
                    break;
                case ChessPieceType.PAWN:
                    img_src = piece.isWhite ? white_pawn : black_pawn;
                    break;
            }
            board[row_number][column_number] = <img src={img_src}
                alt={"" + (piece.isWhite ? "WHITE " : "BLACK ") + piece.type}
            />;
        });

        let row_n = 1, col_n = 0;
        return (
            <table>
                {board.map(row => {
                    row_n++;
                    return (<tr>
                        {row.map(elem => {
                            return <td key={row_n + col_n} className={"cell " + ((row_n + col_n++) % 2 == 0 ? "cell-white" : "cell-black")}>{elem}</td>
                        })}
                    </tr>)
                }
                )}
            </table>
        );
    };

    const parseBoard = (boardStr: string) => {
        let board = [];
        let isWhite = true;
        for (let i = 0; i < boardStr.length; i++) {
            if (boardStr.charAt(i) === "|") {
                isWhite = false;
                continue;
            }

            let type: ChessPieceType;
            switch (boardStr.charAt(i)) {
                case "R":
                    type = ChessPieceType.ROOK;
                    break;
                case "N":
                    type = ChessPieceType.KNIGHT;
                    break;
                case "B":
                    type = ChessPieceType.BISHOP;
                    break;
                case "Q":
                    type = ChessPieceType.QUEEN;
                    break;
                case "K":
                    type = ChessPieceType.KING;
                    break;
                default:
                    type = ChessPieceType.PAWN;
                    break;
            }

            let piece: ChessPiece;
            if (type != ChessPieceType.PAWN) {
                piece = new ChessPiece(type, isWhite, boardStr.substring(i + 1, i + 3));
                i += 2;
            } else {
                piece = new ChessPiece(type, isWhite, boardStr.substring(i, i + 2));
                i++;
            }

            board.push(piece);
        }

        return board;
    }

    return (
        <div>
            {createChessBoard(props.board)}
        </div>
    );
};

export default ChessBoard;
