import { useEffect, useState, type DragEvent, type JSX } from "react";
import "./styles.css";
import { ChessPiece, ChessPieceType } from "./types";

import ChessSquare from "./chess_square";

const STARTING_WHITE: string = "Ra1Nb1Bc1Qd1Ke1Bf1Ng1Rh1a2b2c2d2e2f2g2h2";
const STARTING_BLACK: string = "Ra8Nb8Bc8Qd8Ke8Bf8Ng8Rh8a7b7c7d7e7f7g7h7";
const BOARD_SIZE: number = 8;
interface ChessBoardProps {
    board: string
}

class ChessPieceProps {
    type: ChessPieceType;
    isWhite: boolean;
    pos: string;
    constructor(type: ChessPieceType, isWhite: boolean, pos: string) {
        this.type = type;
        this.isWhite = isWhite;
        this.pos = pos;
    }
}

const ChessBoard = (props: ChessBoardProps) => {

    const [validMoves, setValidMoves] = useState([] as number[]);
    const createChessBoard = (boardStr: string) => {
        if (boardStr.length === 0) {
            boardStr = STARTING_BLACK + "|" + STARTING_WHITE;
        }

        let pieces = parseBoard(boardStr);

        const newBoard: JSX.Element[][] = [];
        for (let row = BOARD_SIZE; row > 0; row--) {
            let column = [];
            for (let col = 0; col < BOARD_SIZE; col++) {
                column.push(<ChessSquare isWhiteSquare={(row + col) % 2 == 0} />);
            }
            newBoard.push(column);
        }

        pieces.map(piece => {
            let row = piece.pos.charAt(1);
            let row_number = Number.parseInt(row) - 1;
            let column_number = piece.pos.charCodeAt(0) - "a".charCodeAt(0);

            newBoard[row_number][column_number] =
                <ChessSquare
                    isWhiteSquare={(row_number + column_number) % 2 == 0}
                    chessPieceProps={new ChessPieceProps(piece.type, piece.isWhite, piece.pos)}
                    handlePieceMoveStart={handlePieceMoveStart}
                    handlePieceMoveEnd={() => { }}
                />;
        });

        return newBoard;
    };

    const handlePieceMoveStart = (event: DragEvent<HTMLDivElement>, pieceType: ChessPieceType, pos: string) => {
        showAvailableMoves(pieceType, pos);
        switch (pieceType) {
            case ChessPieceType.BISHOP:
                break;
            case ChessPieceType.KING:
                break;
            case ChessPieceType.KNIGHT:
                break;
            case ChessPieceType.PAWN:
                break;
            case ChessPieceType.QUEEN:
                break;
            case ChessPieceType.ROOK:
                break;
        }
    }

    const showAvailableMoves = (pieceType: ChessPieceType, pos: string) => {
        if (validMoves !== undefined && validMoves.length > 0) {
            clearValidMoves();
        }
        let col_num: number = pos.charCodeAt(0) - "a".charCodeAt(0);
        let row_num = Number.parseInt(pos.charAt(1)) - 1;
        let validSquares: number[] = [];
        switch (pieceType) {
            case ChessPieceType.BISHOP:
                validSquares = getBishopMoves(row_num, col_num);
                break;
            case ChessPieceType.KING:
                validSquares = getKingMoves(row_num, col_num);
                break;
            case ChessPieceType.KNIGHT:
                break;
            case ChessPieceType.PAWN:
                break;
            case ChessPieceType.QUEEN:
                break;
            case ChessPieceType.ROOK:
                break;
        }

        setValidMoves(validMoves => validMoves.concat(validSquares));
    }

    const clearValidMoves = () => {
        for (let i = 0; i < validMoves.length; i++) {
            const elem = document.getElementById("" + validMoves[i])?.children[0];
            const square_class = elem?.getAttribute("class");
            if (!square_class) {
                continue;
            }
            const idx = square_class?.lastIndexOf("valid");
            if (idx === -1) {
                continue;
            }
            elem?.setAttribute("class", square_class?.substring(0, idx));
        }
        setValidMoves([]);
    }

    const getBishopMoves = (row_num: number, col_num: number) => {
        let i = 1;
        let validSquares: number[] = [];
        while (i + row_num < 8 && i + col_num < 8) {
            let square_element = document.getElementById("" + ((row_num + i) * 8 + col_num + i))?.children[0];
            if (square_element?.childElementCount !== 0) {
                i++;
                continue;
            }
            let square_class = square_element?.className;
            square_element?.setAttribute("class", square_class + " valid");
            validSquares.push((row_num + i) * 8 + col_num + i);
            i++;
        }
        i = 1;
        while (row_num - i >= 0 && i + col_num < 8) {
            let square_element = document.getElementById("" + ((row_num - i) * 8 + col_num + i))?.children[0];
            if (square_element?.childElementCount !== 0) {
                i++;
                continue;
            }
            let square_class = square_element?.className;
            square_element?.setAttribute("class", square_class + " valid");
            validSquares.push((row_num - i) * 8 + col_num + i);
            i++;
        }
        i = 1;
        while (row_num - i >= 0 && col_num - i >= 0) {
            let square_element = document.getElementById("" + ((row_num - i) * 8 + col_num - i))?.children[0];
            if (square_element?.childElementCount !== 0) {
                i++;
                continue;
            }
            let square_class = square_element?.className;
            square_element?.setAttribute("class", square_class + " valid");
            validSquares.push((row_num - i) * 8 + col_num - i);
            i++;
        }
        i = 1;
        while (i + row_num < 8 && col_num - i >= 0) {
            let square_element = document.getElementById("" + ((row_num + i) * 8 + col_num - i))?.children[0];
            if (square_element?.childElementCount !== 0) {
                i++;
                continue;
            }
            let square_class = square_element?.className;
            square_element?.setAttribute("class", square_class + " valid");
            validSquares.push((row_num + i) * 8 + col_num - i);
            i++;
        }

        return validSquares;
    }

    const getKingMoves = (row_num: number, col_num: number) => {
        let validSquares: number[] = [];

        const left = col_num - 1;
        const right = col_num + 1;
        const top = row_num - 1;
        const bottom = row_num + 1;
        const l_square = document.getElementById("" + (row_num * 8 + left))?.children[0];
        const r_square = document.getElementById("" + (row_num * 8 + right))?.children[0];
        const t_square = document.getElementById("" + (top * 8 + col_num))?.children[0];
        const b_square = document.getElementById("" + (bottom * 8 + col_num))?.children[0];

        if (l_square !== null) {
            if (l_square?.childElementCount === 0) {
                const l_square_class = l_square?.className;
                l_square?.setAttribute("class", l_square_class + " valid");
                validSquares.push(row_num * 8 + left);
            }
            if (t_square !== null) {
                const tl_square = document.getElementById("" + (top * 8 + left))?.children[0];
                if (tl_square?.childElementCount === 0) {
                    const tl_square_class = tl_square?.className;
                    tl_square?.setAttribute("class", tl_square_class + " valid");
                    validSquares.push(top * 8 + left);
                }
            }
            if (b_square !== null) {
                const bl_square = document.getElementById("" + (bottom * 8 + left))?.children[0];
                if (bl_square?.childElementCount === 0) {
                    const bl_square_class = bl_square?.className;
                    bl_square?.setAttribute("class", bl_square_class + " valid");
                    validSquares.push(bottom * 8 + left);
                }
            }
        }

        if (r_square !== null) {
            if (r_square?.childElementCount === 0) {
                const r_square_class = r_square?.className;
                r_square?.setAttribute("class", r_square_class + " valid");
                validSquares.push(row_num * 8 + right);
            }
            if (t_square !== null) {
                const tr_square = document.getElementById("" + (top * 8 + right))?.children[0];
                if (tr_square?.childElementCount === 0) {
                    const tr_square_class = tr_square?.className;
                    tr_square?.setAttribute("class", tr_square_class + " valid");
                    validSquares.push(top * 8 + right);
                }
            }
            if (b_square !== null) {
                const br_square = document.getElementById("" + (bottom * 8 + right))?.children[0];
                if (br_square?.childElementCount === 0) {
                    const br_square_class = br_square?.className;
                    br_square?.setAttribute("class", br_square_class + " valid");
                    validSquares.push(bottom * 8 + right);
                }
            }
        }

        if (t_square !== null && t_square?.childElementCount === 0) {
            const t_square_class = t_square?.className;
            t_square?.setAttribute("class", t_square_class + " valid");
            validSquares.push(top * 8 + col_num);
        }
        if (b_square !== null && b_square?.childElementCount === 0) {
            const b_square_class = b_square?.className;
            b_square?.setAttribute("class", b_square_class + " valid");
            validSquares.push(bottom * 8 + col_num);
        }
        return validSquares;
    }

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

    const board = createChessBoard(props.board);

    let num = 0;
    return (
        <div>
            <table>
                {board.map(row => {
                    return (<tr>
                        {row.map(elem => {
                            let td = <td key={num} id={"" + num}>{elem}</td>;
                            num++;
                            return td;
                        })}
                    </tr>)
                }
                )}
            </table>
        </div>
    );
};

export default ChessBoard;
