import { useRef, useState, type JSX, type MouseEvent } from "react";
import { PieceType, ChessPieceInfo, ChessBoardProps, ChessPieceProps } from "../types";
import ChessSquare from "./ChessSquare";
import "../styles.css";

const STARTING_WHITE: string = "Ra1Nb1Bc1Qd1Ke1Bf1Ng1Rh1a2b2c2d2e2f2g2h2";
const STARTING_BLACK: string = "Ra8Nb8Bc8Qd8Ke8Bf8Ng8Rh8a7b7c7d7e7f7g7h7";
const BOARD_SIZE: number = 8;
const PIECE_IMG_PIXEL_SIZE: number = 128;

const ChessBoard = (props: ChessBoardProps) => {

    const [validMoves, setValidMoves] = useState<number[]>([]);
    const [draggedClone, setDraggedClone] = useState<HTMLImageElement>();
    const [dragging, setDragging] = useState(false);
    const dragRef = useRef<EventTarget>(null);

    const createChessBoard = (boardStr: string) => {
        if (boardStr.length === 0) {
            boardStr = STARTING_BLACK + "|" + STARTING_WHITE;
        }

        let pieces = parseBoard(boardStr);

        const newBoard: JSX.Element[][] = [];
        for (let row = BOARD_SIZE; row > 0; row--) {
            let column = [];
            for (let col = 0; col < BOARD_SIZE; col++) {
                column.push(<ChessSquare isWhiteSquare={(row + col) % 2 == 0}
                    handlePieceMoveEnd={handlePieceMoveEnd}
                />);
            }
            newBoard.push(column);
        }

        pieces.map(piece => {
            let pos = convertPiecePosition(piece.pos);
            let rowNumber = pos.row;
            let columnNumber = pos.col;

            newBoard[rowNumber][columnNumber] =
                <ChessSquare
                    isWhiteSquare={(rowNumber + columnNumber) % 2 == 0}
                    chessPieceProps={new ChessPieceProps(piece.rank, piece.isWhite, piece.pos)}
                    handlePieceMoveStart={handlePieceMoveStart}
                    handlePieceMoveEnd={handlePieceMoveEnd}
                />;
        });

        return newBoard;
    };

    const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
        if (!dragging) {
            return;
        }

        handlePieceMove(event);
    }

    const convertPiecePosition = (pos: string) => {
        let row = pos.charAt(1);
        let rowNumber = BOARD_SIZE - Number.parseInt(row);
        let columnNumber = pos.charCodeAt(0) - "a".charCodeAt(0);

        return {
            row: rowNumber,
            col: columnNumber
        }
    }

    const handlePieceMoveStart = (event: MouseEvent, pieceRank: PieceType, pos: string, isWhite: boolean) => {
        if (event.button !== 0) {
            return;
        }
        let target = event.currentTarget;
        dragRef.current = target;
        let clone = target.cloneNode(true).firstChild!;
        if (clone instanceof HTMLImageElement) {
            target.appendChild(clone);
            setDraggedClone(clone);
            moveClone(event, clone);
        }

        if (target.firstChild! instanceof HTMLImageElement) {
            target.firstChild.hidden = true;
        }
        event.stopPropagation();
        event.preventDefault();
        setDragging(true);
        showAvailableMoves(pieceRank, pos, isWhite);
    }

    const handlePieceMove = (event: MouseEvent) => {
        moveClone(event, draggedClone);
    }

    const moveClone = (event: MouseEvent, clone?: HTMLImageElement) => {
        if (clone) {
            clone.style.position = "absolute";
            clone.style.zIndex = "1000";
            clone.style.left = (event.pageX - PIECE_IMG_PIXEL_SIZE / 2) + "px";
            clone.style.top = (event.pageY - PIECE_IMG_PIXEL_SIZE / 2) + "px";
        }
    }

    const handlePieceMoveEnd = (_event: MouseEvent<Element>) => {
        setDragging(false);
        if (draggedClone) {
            draggedClone.remove();
            setDraggedClone(undefined);
        }

        if (dragRef.current instanceof Node && dragRef.current.firstChild instanceof HTMLImageElement) {
            dragRef.current.firstChild.hidden = false;
        }
    }

    const showAvailableMoves = (pieceType: PieceType, pos: string, isWhite: boolean) => {
        if (validMoves !== undefined && validMoves.length > 0) {
            clearValidMoves();
        }
        let piecePosition = convertPiecePosition(pos);
        let row: number = piecePosition.row;
        let col: number = piecePosition.col;
        let validSquares: number[] = [];
        switch (pieceType) {
            case PieceType.BISHOP:
                validSquares = getBishopMoves(row, col);
                break;
            case PieceType.KING:
                validSquares = getKingMoves(row, col);
                break;
            case PieceType.KNIGHT:
                validSquares = getKnightMoves(row, col);
                break;
            case PieceType.PAWN:
                validSquares = getPawnMoves(row, col, isWhite);
                break;
            case PieceType.QUEEN:
                validSquares = getBishopMoves(row, col).concat(getRookMoves(row, col));
                break;
            case PieceType.ROOK:
                validSquares = getRookMoves(row, col);
                break;
        }
        validSquares.forEach(idx => {
            let squareElement = document.getElementById(`${idx}`)?.children[0];
            let squareClass = squareElement?.className;
            squareElement?.setAttribute("class", squareClass + " valid-move");
        });

        setValidMoves(validMoves => validMoves.concat(validSquares));
    }

    const clearValidMoves = () => {
        for (let i = 0; i < validMoves.length; i++) {
            const elem = document.getElementById(`${validMoves[i]}`)?.children[0];
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
        let validSquares: number[] = [];

        let northWestBlocked = false;
        let southWestBlocked = false;
        let northEastBlocked = false;
        let southEastBlocked = false;

        for (let i = 1; i < BOARD_SIZE; i++) {
            if (!northWestBlocked && row + i < BOARD_SIZE && col + i < BOARD_SIZE) {
                const nWestSquareId = (row + i) * BOARD_SIZE + col + i;
                const nWestSquare = document.getElementById(`${nWestSquareId}`)?.children[0];
                if (nWestSquare !== null && nWestSquare?.childElementCount === 0) {
                    validSquares.push(nWestSquareId);
                } else {
                    northWestBlocked = true;
                }
            }

            if (!southWestBlocked && row - i >= 0 && col + i < BOARD_SIZE) {
                const sWestSquareId = (row - i) * BOARD_SIZE + col + i;
                const sWestSquare = document.getElementById(`${sWestSquareId}`)?.children[0];
                if (sWestSquare !== null && sWestSquare?.childElementCount === 0) {
                    validSquares.push(sWestSquareId);
                } else {
                    southWestBlocked = true;
                }
            }

            if (!northEastBlocked && row + i < BOARD_SIZE && col - i >= 0) {
                const nEastSquareId = (row + i) * BOARD_SIZE - (col - i);
                const nEastSquare = document.getElementById(`${nEastSquareId}`)?.children[0];
                if (nEastSquare !== null && nEastSquare?.childElementCount === 0) {
                    validSquares.push(nEastSquareId);
                } else {
                    northEastBlocked = true;
                }
            }

            if (!southEastBlocked && row - i >= 0 && col - i >= 0) {
                const sEastSquareId = (row - i) * BOARD_SIZE - (col - i);
                const sEastSquare = document.getElementById(`${sEastSquareId}`)?.children[0];
                if (sEastSquare !== null && sEastSquare?.childElementCount === 0) {
                    validSquares.push(sEastSquareId);
                } else {
                    southEastBlocked = true;
                }
            }
        }

        return validSquares;
    }

    const getKingMoves = (row: number, col: number) => {
        let validSquares: number[] = [];

        const left = col - 1;
        const right = col + 1;
        const top = row - 1;
        const bottom = row + 1;
        const lSquare = document.getElementById(`${row * BOARD_SIZE + left}`)?.children[0];
        const rSquare = document.getElementById(`${row * BOARD_SIZE + right}`)?.children[0];
        const tSquare = document.getElementById(`${top * BOARD_SIZE + col}`)?.children[0];
        const bSquare = document.getElementById(`${bottom * BOARD_SIZE + col}`)?.children[0];

        if (lSquare !== null) {
            if (lSquare?.childElementCount === 0) {
                validSquares.push(row * BOARD_SIZE + left);
            }
            if (tSquare !== null) {
                const topLeftSquare = document.getElementById(`${top * BOARD_SIZE + left}`)
                    ?.children[0];
                if (topLeftSquare?.childElementCount === 0) {
                    validSquares.push(top * BOARD_SIZE + left);
                }
            }
            if (bSquare !== null) {
                const btmLeftSquare = document.getElementById(`${bottom * BOARD_SIZE + left}`)
                    ?.children[0];
                if (btmLeftSquare?.childElementCount === 0) {
                    validSquares.push(bottom * BOARD_SIZE + left);
                }
            }
        }

        if (rSquare !== null) {
            if (rSquare?.childElementCount === 0) {
                validSquares.push(row * BOARD_SIZE + right);
            }
            if (tSquare !== null) {
                const topRightSquare = document.getElementById(`${top * BOARD_SIZE + right}`)
                    ?.children[0];
                if (topRightSquare?.childElementCount === 0) {
                    validSquares.push(top * BOARD_SIZE + right);
                }
            }
            if (bSquare !== null) {
                const btmRightSquare = document.getElementById(`${bottom * BOARD_SIZE + right}`)
                    ?.children[0];
                if (btmRightSquare?.childElementCount === 0) {
                    validSquares.push(bottom * BOARD_SIZE + right);
                }
            }
        }

        if (tSquare !== null && tSquare?.childElementCount === 0) {
            validSquares.push(top * BOARD_SIZE + col);
        }
        if (bSquare !== null && bSquare?.childElementCount === 0) {
            validSquares.push(bottom * BOARD_SIZE + col);
        }
        return validSquares;
    }

    const getKnightMoves = (row: number, col: number) => {
        const validSquares: number[] = [];

        const squares = [];

        if (row - 2 >= 0) {
            if (col - 1 >= 0) {
                squares.push(document.getElementById(`${(row - 2) * BOARD_SIZE + (col - 1)}`));
            }
            if (col + 1 < BOARD_SIZE) {
                squares.push(document.getElementById(`${(row - 2) * BOARD_SIZE + (col + 1)}`));
            }
        }

        if (row - 1 >= 0) {
            if (col - 2 >= 0) {
                squares.push(document.getElementById(`${(row - 1) * BOARD_SIZE + (col - 2)}`));
            }
            if (col + 2 < BOARD_SIZE) {
                squares.push(document.getElementById(`${(row - 1) * BOARD_SIZE + (col + 2)}`));
            }
        }

        if (row + 2 < BOARD_SIZE) {
            if (col - 1 >= 0) {
                squares.push(document.getElementById(`${(row + 2) * BOARD_SIZE + (col - 1)}`));
            }
            if (col + 1 < BOARD_SIZE) {
                squares.push(document.getElementById(`${(row + 2) * BOARD_SIZE + (col + 1)}`));
            }
        }

        if (row + 1 < BOARD_SIZE) {
            if (col - 2 >= 0) {
                squares.push(document.getElementById(`${(row + 1) * BOARD_SIZE + (col - 2)}`));
            }
            if (col + 2 < BOARD_SIZE) {
                squares.push(document.getElementById(`${(row + 1) * BOARD_SIZE + (col - 2)}`));
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

    const getPawnMoves = (row: number, col: number, isWhitePawn: boolean) => {

        // if the pawn reaches the last row, its no longer a pawn. No need to check if the move goes past the last rank
        const validSquares: number[] = [];
        if (isWhitePawn) {
            const firstSquareId = (row - 1) * BOARD_SIZE + (col);
            const squareOne = document.getElementById(`${firstSquareId}`)?.children[0];
            if (squareOne?.childElementCount !== 0) {
                return validSquares;
            }
            validSquares.push(firstSquareId);
            if (row === 6) {
                let secondSquareId = (row - 2) * BOARD_SIZE + (col);
                const squareTwo = document.getElementById(`${secondSquareId}`)?.children[0];
                if (squareTwo?.childElementCount === 0) {
                    validSquares.push(secondSquareId);
                }
            }
        }
        else {
            const firstSquareId = (row + 1) * BOARD_SIZE + (col);
            const squareOne = document.getElementById(`${firstSquareId}`)?.children[0];
            if (squareOne?.childElementCount !== 0) {
                return validSquares;
            }
            validSquares.push(firstSquareId);
            if (row === 1) {
                let secondSquareId = (row + 2) * BOARD_SIZE + (col);
                const squareTwo = document.getElementById(`${secondSquareId}`)?.children[0];
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
        for (let i = 1; i < BOARD_SIZE; i++) {
            if (row + i < BOARD_SIZE && !btmBlocked) {
                const btmSquareId = (row + i) * BOARD_SIZE + col;
                const btmSquare = document.getElementById(`${btmSquareId}`)?.children[0];
                if (btmSquare !== null && btmSquare?.childElementCount === 0) {
                    validSquares.push(btmSquareId);
                } else {
                    btmBlocked = true;
                }
            }

            if (row - i >= 0 && !topBlocked) {
                const topSquareId = (row - i) * BOARD_SIZE + col;
                const topSquare = document.getElementById(`${topSquareId}`)?.children[0];
                if (topSquare !== null && topSquare?.childElementCount === 0) {
                    validSquares.push(topSquareId);
                } else {
                    topBlocked = true;
                }
            }

            if (col + i < BOARD_SIZE && !leftBlocked) {
                const leftSquareId = row * BOARD_SIZE + (col + i);
                const leftSquare = document.getElementById(`${leftSquareId}`)?.children[0];
                if (leftSquare !== null && leftSquare?.childElementCount === 0) {
                    validSquares.push(leftSquareId);
                } else {
                    leftBlocked = true;
                }
            }

            if (col - i >= 0 && !rightBlocked) {
                const rightSquareId = row * BOARD_SIZE + (col - i);
                const rightSquare = document.getElementById(`${rightSquareId}`)?.children[0];
                if (rightSquare !== null && rightSquare?.childElementCount === 0) {
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

            let type: PieceType;
            switch (boardStr.charAt(i)) {
                case "R":
                    type = PieceType.ROOK;
                    break;
                case "N":
                    type = PieceType.KNIGHT;
                    break;
                case "B":
                    type = PieceType.BISHOP;
                    break;
                case "Q":
                    type = PieceType.QUEEN;
                    break;
                case "K":
                    type = PieceType.KING;
                    break;
                default:
                    type = PieceType.PAWN;
                    break;
            }

            let piece: ChessPieceInfo;
            if (type != PieceType.PAWN) {
                piece = new ChessPieceInfo(type, isWhite, boardStr.substring(i + 1, i + 3));
                i += 2;
            } else {
                piece = new ChessPieceInfo(type, isWhite, boardStr.substring(i, i + 2));
                i++;
            }

            board.push(piece);
        }

        return board;
    }

    const board = createChessBoard(props.board);

    let squareId = 0;
    return (
        <div
            onMouseMove={(event) =>
                handleMouseMove(event)}>
            <table>
                {board.map(row => {
                    return (<tr>
                        {row.map(elem => {
                            let td = <td key={squareId} id={`${squareId}`}>{elem}</td>;
                            squareId++;
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
