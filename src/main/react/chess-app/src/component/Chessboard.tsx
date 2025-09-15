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
            let pos = getPosition(piece.pos);
            let rowNumber = pos.row;
            let columnNumber = pos.col;

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

    const getPosition = (pos: string) => {
        let row = pos.charAt(1);
        let rowNumber = BOARD_SIZE - Number.parseInt(row);
        let columnNumber = pos.charCodeAt(0) - "a".charCodeAt(0);

        return {
            row: rowNumber,
            col: columnNumber
        }
    }

    const handlePieceMoveStart = (event: DragEvent<HTMLDivElement>, pieceRank: PieceRank, pos: string, isWhite: boolean) => {
        showAvailableMoves(pieceRank, pos, isWhite);
    }

    const showAvailableMoves = (pieceType: PieceRank, pos: string, isWhite: boolean) => {
        if (validMoves !== undefined && validMoves.length > 0) {
            clearValidMoves();
        }
        let piecePosition = getPosition(pos);
        let row: number = piecePosition.row;
        let col: number = piecePosition.col;
        let validSquares: number[] = [];
        switch (pieceType) {
            case PieceRank.BISHOP:
                validSquares = getBishopMoves(row, col);
                break;
            case PieceRank.KING:
                validSquares = getKingMoves(row, col);
                break;
            case PieceRank.KNIGHT:
                validSquares = getKnightMoves(row, col);
                break;
            case PieceRank.PAWN:
                validSquares = getPawnMoves(row, col, isWhite);
                break;
            case PieceRank.QUEEN:
                validSquares = getBishopMoves(row, col).concat(getRookMoves(row, col));
                break;
            case PieceRank.ROOK:
                validSquares = getRookMoves(row, col);
                break;
        }
        validSquares.forEach(idx => {
            let squareElement = document.getElementById("" + idx)?.children[0];
            let squareClass = squareElement?.className;
            squareElement?.setAttribute("class", squareClass + " valid-move");
        });

        setValidMoves(validMoves => validMoves.concat(validSquares));
    }

    const clearValidMoves = () => {
        for (let i = 0; i < validMoves.length; i++) {
            const elem = document.getElementById("" + validMoves[i])?.children[0];
            const squareClass = elem?.getAttribute("class");
            if (!squareClass) {
                continue;
            }
            const idx = squareClass?.lastIndexOf("valid-move");
            if (idx === -1) {
                continue;
            }
            elem?.setAttribute("class", squareClass?.substring(0, idx));
        }
        setValidMoves([]);
    }

    const getBishopMoves = (row: number, col: number) => {
        let i = 1;
        let validSquares: number[] = [];
        while (i + row < 8 && i + col < 8) {
            let squareElement = document.getElementById("" + ((row + i) * 8 + col + i))?.children[0];
            if (squareElement?.childElementCount !== 0) {
                break;
            }
            validSquares.push((row + i) * 8 + col + i);
            i++;
        }
        i = 1;
        while (row - i >= 0 && i + col < 8) {
            let squareElement = document.getElementById("" + ((row - i) * 8 + col + i))?.children[0];
            if (squareElement?.childElementCount !== 0) {
                break;
            }
            validSquares.push((row - i) * 8 + col + i);
            i++;
        }
        i = 1;
        while (row - i >= 0 && col - i >= 0) {
            let squareElement = document.getElementById("" + ((row - i) * 8 + col - i))?.children[0];
            if (squareElement?.childElementCount !== 0) {
                break;
            }
            validSquares.push((row - i) * 8 + col - i);
            i++;
        }
        i = 1;
        while (i + row < 8 && col - i >= 0) {
            let squareElement = document.getElementById("" + ((row + i) * 8 + col - i))?.children[0];
            if (squareElement?.childElementCount !== 0) {
                break;
            }
            validSquares.push((row + i) * 8 + col - i);
            i++;
        }

        return validSquares;
    }

    const getKingMoves = (row: number, col: number) => {
        let validSquares: number[] = [];

        const left = col - 1;
        const right = col + 1;
        const top = row - 1;
        const bottom = row + 1;
        const lSquare = document.getElementById("" + (row * 8 + left))?.children[0];
        const rSquare = document.getElementById("" + (row * 8 + right))?.children[0];
        const tSquare = document.getElementById("" + (top * 8 + col))?.children[0];
        const bSquare = document.getElementById("" + (bottom * 8 + col))?.children[0];

        if (lSquare !== null) {
            if (lSquare?.childElementCount === 0) {
                validSquares.push(row * 8 + left);
            }
            if (tSquare !== null) {
                const topLeftSquare = document.getElementById("" + (top * 8 + left))?.children[0];
                if (tSquare?.childElementCount === 0) {
                    validSquares.push(top * 8 + left);
                }
            }
            if (bSquare !== null) {
                const btmLeftSquare = document.getElementById("" + (bottom * 8 + left))?.children[0];
                if (btmLeftSquare?.childElementCount === 0) {
                    validSquares.push(bottom * 8 + left);
                }
            }
        }

        if (rSquare !== null) {
            if (rSquare?.childElementCount === 0) {
                validSquares.push(row * 8 + right);
            }
            if (tSquare !== null) {
                const topRightSquare = document.getElementById("" + (top * 8 + right))?.children[0];
                if (topRightSquare?.childElementCount === 0) {
                    validSquares.push(top * 8 + right);
                }
            }
            if (bSquare !== null) {
                const btmRightSquare = document.getElementById("" + (bottom * 8 + right))?.children[0];
                if (btmRightSquare?.childElementCount === 0) {
                    validSquares.push(bottom * 8 + right);
                }
            }
        }

        if (tSquare !== null && tSquare?.childElementCount === 0) {
            validSquares.push(top * 8 + col);
        }
        if (bSquare !== null && bSquare?.childElementCount === 0) {
            validSquares.push(bottom * 8 + col);
        }
        return validSquares;
    }

    const getKnightMoves = (row: number, col: number) => {
        const validSquares: number[] = [];

        const squares = [];

        if (row - 2 >= 0) {
            if (col - 1 >= 0) {
                squares.push(document.getElementById("" + ((row - 2) * 8 + (col - 1))));
            }
            if (col + 1 < 8) {
                squares.push(document.getElementById("" + ((row - 2) * 8 + (col + 1))));
            }
        }

        if (row - 1 >= 0) {
            if (col - 2 >= 0) {
                squares.push(document.getElementById("" + ((row - 1) * 8 + (col - 2))));
            }
            if (col + 2 < 8) {
                squares.push(document.getElementById("" + ((row - 1) * 8 + (col + 2))));
            }
        }

        if (row + 2 < 8) {
            if (col - 1 >= 0) {
                squares.push(document.getElementById("" + ((row + 2) * 8 + (col - 1))));
            }
            if (col + 1 < 8) {
                squares.push(document.getElementById("" + ((row + 2) * 8 + (col + 1))));
            }
        }

        if (row + 1 < 8) {
            if (col - 2 >= 0) {
                squares.push(document.getElementById("" + ((row + 1) * 8 + (col - 2))));
            }
            if (col + 2 < 8) {
                squares.push(document.getElementById("" + ((row + 1) * 8 + (col + 2))));
            }
        }

        squares.forEach((square) => {
            if (square === null) {
                return;
            }

            const squareChild = square.children[0];

            if (squareChild.childElementCount !== 0) {
                return;
            }
            validSquares.push(Number.parseInt(square.id));
        });

        return validSquares;
    }

    const getPawnMoves = (row: number, col: number, pawnIsWhite: boolean) => {

        // if the pawn reaches the last row, its no longer a pawn. No need to check if the move goes past the last rank
        const validSquares: number[] = [];
        if (pawnIsWhite) {
            const firstSquareId = (row - 1) * 8 + (col);
            let secondSquareId = -1;
            const squareOne = document.getElementById("" + firstSquareId)?.children[0];
            if (squareOne?.childElementCount !== 0) {
                return validSquares;
            }
            validSquares.push(firstSquareId);
            if (row === 6) {
                secondSquareId = (row - 2) * 8 + (col);
                const squareTwo = document.getElementById("" + secondSquareId)?.children[0];
                if (squareTwo?.childElementCount === 0) {
                    validSquares.push(secondSquareId);
                }
            }
        }
        else {
            const firstSquareId = (row + 1) * 8 + (col);
            let secondSquareId = -1;
            const squareOne = document.getElementById("" + firstSquareId)?.children[0];
            if (squareOne?.childElementCount !== 0) {
                return validSquares;
            }
            validSquares.push(firstSquareId);
            if (row === 1) {
                secondSquareId = (row + 2) * 8 + (col);
                const squareTwo = document.getElementById("" + secondSquareId)?.children[0];
                if (squareTwo?.childElementCount === 0) {
                    validSquares.push(secondSquareId);
                }
            }
        }

        return validSquares;
    }

    const getRookMoves = (row: number, col: number) => {
        const validSquares: number[] = [];

        let topBlocked = false;
        let btmBlocked = false;
        let leftBlocked = false;
        let rightBlocked = false;
        for (let i = 1; i < 8; i++) {
            if (row + i < 8) {
                const btmSquareId = (row + i) * 8 + col;
                const btmSquare = document.getElementById("" + btmSquareId)?.children[0];
                if (btmSquare !== null && btmSquare?.childElementCount === 0 && !btmBlocked) {
                    validSquares.push(btmSquareId);
                } else {
                    btmBlocked = true;
                }
            }

            if (row - i >= 0) {
                const topSquareId = (row - i) * 8 + col;
                const topSquare = document.getElementById("" + topSquareId)?.children[0];
                if (topSquare !== null && topSquare?.childElementCount === 0 && !topBlocked) {
                    validSquares.push(topSquareId);
                } else {
                    topBlocked = true;
                }
            }

            if (col + i < 8) {
                const leftSquareId = row * 8 + (col + i);
                const leftSquare = document.getElementById("" + leftSquareId)?.children[0];
                if (leftSquare !== null && leftSquare?.childElementCount === 0 && !leftBlocked) {
                    validSquares.push(leftSquareId);
                } else {
                    leftBlocked = true;
                }
            }

            if (col - i >= 0) {
                const rightSquareId = row * 8 + (col - i);
                const rightSquare = document.getElementById("" + rightSquareId)?.children[0];
                if (rightSquare !== null && rightSquare?.childElementCount === 0 && !rightBlocked) {
                    validSquares.push(rightSquareId);
                } else {
                    rightBlocked = true;
                }
            }
        }

        return validSquares;
    }

    const parseBoard = (boardStr: string) => {
        let board = [];
        let isWhite = false;
        for (let i = 0; i < boardStr.length; i++) {
            if (boardStr.charAt(i) === "|") {
                isWhite = true;
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
