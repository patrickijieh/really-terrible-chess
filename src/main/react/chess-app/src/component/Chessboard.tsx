import { useState, type DragEvent, type JSX } from "react";
import "../styles.css";
import { PieceRank, ChessPieceType, ChessBoardProps, ChessPieceProps } from "../types";

import ChessSquare from "./ChessSquare";

const STARTING_WHITE: string = "Ra1Nb1Bc1Qd1Ke1Bf1Ng1Rh1a2b2c2d2e2f2g2h2";
const STARTING_BLACK: string = "Ra8Nb8Bc8Qd8Ke8Bf8Ng8Rh8a7b7c7d7e7f7g7h7";
const BOARD_SIZE: number = 8;

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
            let rowNumber = Number.parseInt(row) - 1;
            let columnNumber = piece.pos.charCodeAt(0) - "a".charCodeAt(0);

            newBoard[rowNumber][columnNumber] =
                <ChessSquare
                    isWhiteSquare={(rowNumber + columnNumber) % 2 == 0}
                    chessPieceProps={new ChessPieceProps(piece.rank, piece.isWhite, piece.pos)}
                    handlePieceMoveStart={handlePieceMoveStart}
                    handlePieceMoveEnd={() => { }}
                />;
        });

        return newBoard;
    };

    const handlePieceMoveStart = (_event: DragEvent<HTMLDivElement>, pieceRank: PieceRank, pos: string) => {
        showAvailableMoves(pieceRank, pos);
    }

    const showAvailableMoves = (pieceType: PieceRank, pos: string) => {
        if (validMoves !== undefined && validMoves.length > 0) {
            clearValidMoves();
        }
        let col: number = pos.charCodeAt(0) - "a".charCodeAt(0);
        let row: number = Number.parseInt(pos.charAt(1)) - 1;
        let validSquares: number[] = [];
        switch (pieceType) {
            case PieceRank.BISHOP:
                validSquares = getBishopMoves(row, col);
                break;
            case PieceRank.KING:
                validSquares = getKingMoves(row, col);
                break;
            case PieceRank.KNIGHT:
                break;
            case PieceRank.PAWN:
                break;
            case PieceRank.QUEEN:
                break;
            case PieceRank.ROOK:
                break;
        }

        setValidMoves(validMoves => validMoves.concat(validSquares));
    }

    const clearValidMoves = () => {
        for (let i = 0; i < validMoves.length; i++) {
            const elem = document.getElementById("" + validMoves[i])?.children[0];
            const squareClass = elem?.getAttribute("class");
            if (!squareClass) {
                continue;
            }
            const idx = squareClass?.lastIndexOf("valid");
            if (idx === -1) {
                continue;
            }
            elem?.setAttribute("class", squareClass?.substring(0, idx));
        }
        setValidMoves([]);
    }

    const getBishopMoves = (row_num: number, col_num: number) => {
        let i = 1;
        let validSquares: number[] = [];
        while (i + row_num < 8 && i + col_num < 8) {
            let squareElement = document.getElementById("" + ((row_num + i) * 8 + col_num + i))?.children[0];
            if (squareElement?.childElementCount !== 0) {
                i++;
                continue;
            }
            let squareClass = squareElement?.className;
            squareElement?.setAttribute("class", squareClass + " valid");
            validSquares.push((row_num + i) * 8 + col_num + i);
            i++;
        }
        i = 1;
        while (row_num - i >= 0 && i + col_num < 8) {
            let squareElement = document.getElementById("" + ((row_num - i) * 8 + col_num + i))?.children[0];
            if (squareElement?.childElementCount !== 0) {
                i++;
                continue;
            }
            let squareClass = squareElement?.className;
            squareElement?.setAttribute("class", squareClass + " valid");
            validSquares.push((row_num - i) * 8 + col_num + i);
            i++;
        }
        i = 1;
        while (row_num - i >= 0 && col_num - i >= 0) {
            let squareElement = document.getElementById("" + ((row_num - i) * 8 + col_num - i))?.children[0];
            if (squareElement?.childElementCount !== 0) {
                i++;
                continue;
            }
            let squareClass = squareElement?.className;
            squareElement?.setAttribute("class", squareClass + " valid");
            validSquares.push((row_num - i) * 8 + col_num - i);
            i++;
        }
        i = 1;
        while (i + row_num < 8 && col_num - i >= 0) {
            let squareElement = document.getElementById("" + ((row_num + i) * 8 + col_num - i))?.children[0];
            if (squareElement?.childElementCount !== 0) {
                i++;
                continue;
            }
            let squareClass = squareElement?.className;
            squareElement?.setAttribute("class", squareClass + " valid");
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
        const lSquare = document.getElementById("" + (row_num * 8 + left))?.children[0];
        const rSquare = document.getElementById("" + (row_num * 8 + right))?.children[0];
        const tSquare = document.getElementById("" + (top * 8 + col_num))?.children[0];
        const bSquare = document.getElementById("" + (bottom * 8 + col_num))?.children[0];

        if (lSquare !== null) {
            if (lSquare?.childElementCount === 0) {
                const lSquareClass = lSquare?.className;
                lSquare?.setAttribute("class", lSquareClass + " valid");
                validSquares.push(row_num * 8 + left);
            }
            if (tSquare !== null) {
                const topLeftSquare = document.getElementById("" + (top * 8 + left))?.children[0];
                if (tSquare?.childElementCount === 0) {
                    const topLeftSquareClass = topLeftSquare?.className;
                    topLeftSquare?.setAttribute("class", topLeftSquareClass + " valid");
                    validSquares.push(top * 8 + left);
                }
            }
            if (bSquare !== null) {
                const btmLeftSquare = document.getElementById("" + (bottom * 8 + left))?.children[0];
                if (btmLeftSquare?.childElementCount === 0) {
                    const btmLeftSquareClass = btmLeftSquare?.className;
                    btmLeftSquare?.setAttribute("class", btmLeftSquareClass + " valid");
                    validSquares.push(bottom * 8 + left);
                }
            }
        }

        if (rSquare !== null) {
            if (rSquare?.childElementCount === 0) {
                const rSquareClass = rSquare?.className;
                rSquare?.setAttribute("class", rSquareClass + " valid");
                validSquares.push(row_num * 8 + right);
            }
            if (tSquare !== null) {
                const topRightSquare = document.getElementById("" + (top * 8 + right))?.children[0];
                if (topRightSquare?.childElementCount === 0) {
                    const topRightSquareClass = topRightSquare?.className;
                    topRightSquare?.setAttribute("class", topRightSquareClass + " valid");
                    validSquares.push(top * 8 + right);
                }
            }
            if (bSquare !== null) {
                const btmRightSquare = document.getElementById("" + (bottom * 8 + right))?.children[0];
                if (btmRightSquare?.childElementCount === 0) {
                    const btmRightSquareClass = btmRightSquare?.className;
                    btmRightSquare?.setAttribute("class", btmRightSquareClass + " valid");
                    validSquares.push(bottom * 8 + right);
                }
            }
        }

        if (tSquare !== null && tSquare?.childElementCount === 0) {
            const tSquareClass = tSquare?.className;
            tSquare?.setAttribute("class", tSquareClass + " valid");
            validSquares.push(top * 8 + col_num);
        }
        if (bSquare !== null && bSquare?.childElementCount === 0) {
            const bSquareClass = bSquare?.className;
            bSquare?.setAttribute("class", bSquareClass + " valid");
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

            let type: PieceRank;
            switch (boardStr.charAt(i)) {
                case "R":
                    type = PieceRank.ROOK;
                    break;
                case "N":
                    type = PieceRank.KNIGHT;
                    break;
                case "B":
                    type = PieceRank.BISHOP;
                    break;
                case "Q":
                    type = PieceRank.QUEEN;
                    break;
                case "K":
                    type = PieceRank.KING;
                    break;
                default:
                    type = PieceRank.PAWN;
                    break;
            }

            let piece: ChessPieceType;
            if (type != PieceRank.PAWN) {
                piece = new ChessPieceType(type, isWhite, boardStr.substring(i + 1, i + 3));
                i += 2;
            } else {
                piece = new ChessPieceType(type, isWhite, boardStr.substring(i, i + 2));
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
