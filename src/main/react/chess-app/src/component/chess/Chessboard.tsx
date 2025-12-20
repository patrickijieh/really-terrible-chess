import { useRef, useState, useEffect, type JSX, type MouseEvent } from "react";
import { PieceType, ChessPieceInfo, ChessBoardProps, ChessPieceProps } from "./types";
import ChessSquare from "./ChessSquare";
import "../../styles.css";

const STARTING_WHITE: string = "Ra1Nb1Bc1Qd1Ke1Bf1Ng1Rh1a2b2c2d2e2f2g2h2";
const STARTING_BLACK: string = "Ra8Nb8Bc8Qd8Ke8Bf8Ng8Rh8a7b7c7d7e7f7g7h7";
const BOARD_SIZE: number = 8;
const PIECE_IMG_PIXEL_SIZE: number = 128;

const ChessBoard = (props: ChessBoardProps) => {

    const [chessPieceBoard, setChessPieceBoard] = useState<ChessPieceInfo[][]>([]);
    const [validMoves, setValidMoves] = useState<string[]>([]);
    const [draggedClone, setDraggedClone] = useState<HTMLImageElement | null>();
    const [dragging, setDragging] = useState(false);
    const [dropped, setDropped] = useState(false);
    const dragRef = useRef<EventTarget>(null);

    useEffect(() => {
        let pieceBoard = createChessPieceBoard(props.board);
        setChessPieceBoard(pieceBoard);
    }, [props.board]);

    const createChessPieceBoard = (boardStr: string) => {
        if (!boardStr || boardStr.length === 0) {
            boardStr = STARTING_WHITE + "|" + STARTING_BLACK;
        }

        let pieces = parseBoard(boardStr);

        const newPieceBoard: ChessPieceInfo[][] = new Array<ChessPieceInfo[]>(BOARD_SIZE);
        for (let i = 0; i < BOARD_SIZE; i++) {
            newPieceBoard[i] = new Array<ChessPieceInfo>(BOARD_SIZE);
        }

        pieces.map(piece => {
            let pos = convertStringToPosition(piece.pos);
            let rowNumber = pos.row;
            let columnNumber = pos.col;

            newPieceBoard[rowNumber][columnNumber] = piece;
        });

        return newPieceBoard;
    };

    const createChessBoardSquares = (pieceBoard: ChessPieceInfo[][]) => {
        const newBoard: JSX.Element[][] = [];
        if (pieceBoard.length === 0) {
            return newBoard;
        }

        for (let row = 0; row < BOARD_SIZE; row++) {
            let column = [];
            for (let col = 0; col < BOARD_SIZE; col++) {
                let piece = pieceBoard[row][col];
                if (piece != null) {
                    column.push(<ChessSquare
                        row={row}
                        col={col}
                        isWhiteSquare={(row + col) % 2 == 0}
                        chessPieceProps={new ChessPieceProps(piece.type, piece.isWhite, piece.pos)}
                        handlePieceMoveStart={handlePieceMoveStart}
                        handlePieceMoveEnd={handlePieceMoveEnd}
                        handleDrop={handleDrop}
                    />);
                } else {
                    column.push(<ChessSquare
                        isWhiteSquare={(row + col) % 2 == 0}
                        row={row}
                        col={col}
                        handlePieceMoveEnd={handlePieceMoveEnd}
                        handleDrop={handleDrop}
                    />);
                }
            }
            newBoard.push(column);
        }

        return newBoard;
    }

    const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
        if (!dragging) {
            return;
        }

        handlePieceMove(event);
    }

    const handlePieceMove = (event: MouseEvent) => {
        if (draggedClone != null) {
            moveClone(event, draggedClone);
        }
    }

    const convertStringToPosition = (pos: string) => {
        let row = pos.charAt(1);
        let rowNumber = Number.parseInt(row) - 1;
        let columnNumber = pos.charCodeAt(0) - "a".charCodeAt(0);

        return {
            row: rowNumber,
            col: columnNumber
        }
    }

    const convertPositionToString = (row: number, col: number) => {
        let columnLabel = String.fromCharCode(col + "a".charCodeAt(0));
        return columnLabel + "" + (row + 1);
    }

    const convertIdToAlgebraicNotation = (pos: string) => {
        let split = pos.split(",");
        let row = Number.parseInt(split[0]) + 1;
        let col = Number.parseInt(split[1]);

        let colLetter = String.fromCharCode("a".charCodeAt(0) + col);
        return colLetter + row;
    }

    const handlePieceMoveStart = (event: MouseEvent, pieceRank: PieceType, pos: string, isPieceWhite: boolean) => {
        if (event.button !== 0) {
            return;
        }

        if (props.isPlayerWhite !== isPieceWhite) {
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
        showAvailableMoves(pieceRank, pos, isPieceWhite);
    }

    const moveClone = (event: MouseEvent, clone?: HTMLImageElement) => {
        if (clone) {
            clone.style.position = "absolute";
            clone.style.zIndex = "1000";
            clone.style.left = (event.pageX - PIECE_IMG_PIXEL_SIZE / 2) + "px";
            clone.style.top = (event.pageY - PIECE_IMG_PIXEL_SIZE / 2) + "px";
        }
    }

    const handlePieceMoveEnd = (isWhite: boolean) => {
        if (props.isPlayerWhite !== isWhite) {
            return;
        }

        setDragging(false);
        setDropped(true);
        if (draggedClone) {
            draggedClone.remove();
            setDraggedClone(null);
        }

        if (dragRef.current instanceof Node && dragRef.current.firstChild instanceof HTMLImageElement) {
            dragRef.current.firstChild.hidden = false;
        }
    }

    const handleDrop = (row: number, col: number) => {
        if (!dropped) {
            return;
        }

        if (!(dragRef.current instanceof Node) || !(dragRef.current.firstChild instanceof HTMLImageElement)) {
            setDropped(false);
            return;
        }

        let draggedPieceType = dragRef.current.firstChild.getAttribute("piece-type");
        let draggedPieceColor = dragRef.current.firstChild.getAttribute("piece-color");

        let pieceColor: string = "";
        switch (draggedPieceColor) {
            case "BLACK":
                pieceColor = "b";
                break;
            case "WHITE":
                pieceColor = "w";
                break;
        }

        let pieceNotation: string;
        switch (draggedPieceType) {
            case PieceType.BISHOP:
                pieceNotation = "B";
                break;
            case PieceType.KING:
                pieceNotation = "K";
                break;
            case PieceType.KNIGHT:
                pieceNotation = "N";
                break;
            case PieceType.QUEEN:
                pieceNotation = "Q";
                break;
            case PieceType.ROOK:
                pieceNotation = "R";
                break;
            default:
                pieceNotation = "";
        }

        let pos = dragRef.current.parentElement?.id;
        let oldPosition: string = "";
        if (pos !== undefined) {
            oldPosition = convertIdToAlgebraicNotation(pos);
        }

        let newSquare = document.getElementById(`${row},${col}`);
        if (pos === `${row},${col}`) {
            setDropped(false);
            return;
        }

        let capture = false;
        if (newSquare?.childElementCount !== 0 && newSquare?.firstChild?.firstChild instanceof HTMLImageElement) {
            let otherPieceColor = newSquare?.firstChild.firstChild.getAttribute("piece-color");
            console.log("piece detected");
            if (otherPieceColor !== draggedPieceColor) {
                console.log("different colors");
                capture = true;
            }
        }

        setDropped(false);
        let newPosition = convertPositionToString(row, col);
        if (capture) {
            newPosition = "x" + newPosition;
        }
        clearValidMoves();
        props.sendMove(pieceColor + pieceNotation + oldPosition + ">" + newPosition);
    }

    const showAvailableMoves = (pieceType: PieceType, pos: string, isPieceWhite: boolean) => {
        if (validMoves !== undefined && validMoves.length > 0) {
            clearValidMoves();
        }
        let piecePosition = convertStringToPosition(pos);
        let row: number = piecePosition.row;
        let col: number = piecePosition.col;
        let validSquareIds: string[] = [];
        switch (pieceType) {
            case PieceType.BISHOP:
                validSquareIds = getBishopMoves(row, col);
                break;
            case PieceType.KING:
                validSquareIds = getKingMoves(row, col);
                break;
            case PieceType.KNIGHT:
                validSquareIds = getKnightMoves(row, col);
                break;
            case PieceType.PAWN:
                validSquareIds = getPawnMoves(row, col, isPieceWhite);
                break;
            case PieceType.QUEEN:
                validSquareIds = getQueenMoves(row, col);
                break;
            case PieceType.ROOK:
                validSquareIds = getRookMoves(row, col);
                break;
        }
        validSquareIds.forEach(idx => {
            let squareElement = document.getElementById(`${idx}`)?.children[0];
            let squareClass = squareElement?.className;
            squareElement?.setAttribute("class", squareClass + " valid-move");
        });

        setValidMoves(validMoves => validMoves.concat(validSquareIds));
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
            elem?.setAttribute("class", squareClass?.substring(0, idx - 1));
        }
        setValidMoves([]);
    }

    const getBishopMoves = (row: number, col: number) => {
        let validSquareIds: string[] = [];

        let nWestBlocked = false;
        let sWestBlocked = false;
        let nEastBlocked = false;
        let sEastBlocked = false;

        for (let i = 1; i < BOARD_SIZE; i++) {
            if (!nWestBlocked && row + i < BOARD_SIZE && col - i >= 0) {
                const nWestPiece = chessPieceBoard[row + i][col - i];
                if (nWestPiece == null) {
                    validSquareIds.push(`${row + i},${col - i}`);
                } else {
                    if (nWestPiece.isWhite !== props.isPlayerWhite) {
                        validSquareIds.push(`${row + i},${col - i}`);
                    }
                    nWestBlocked = true;
                }
            }

            if (!sWestBlocked && row - i >= 0 && col - i >= 0) {
                const sWestPiece = chessPieceBoard[row - i][col - i];
                if (sWestPiece == null) {
                    validSquareIds.push(`${row - i},${col - i}`);
                } else {
                    if (sWestPiece.isWhite !== props.isPlayerWhite) {
                        validSquareIds.push(`${row - i},${col - i}`);
                    }
                    sWestBlocked = true;
                }
            }

            if (!nEastBlocked && row + i < BOARD_SIZE && col + i < BOARD_SIZE) {
                const nEastPiece = chessPieceBoard[row + i][col + i];
                if (nEastPiece == null) {
                    validSquareIds.push(`${row + i},${col + i}`);
                } else {
                    if (nEastPiece.isWhite !== props.isPlayerWhite) {
                        validSquareIds.push(`${row + i},${col + i}`);
                    }
                    nEastBlocked = true;
                }
            }

            if (!sEastBlocked && row - i >= 0 && col + i < BOARD_SIZE) {
                const sEastPiece = chessPieceBoard[row - i][col + i];
                if (sEastPiece == null) {
                    validSquareIds.push(`${row - i},${col + i}`);
                } else {
                    if (sEastPiece.isWhite !== props.isPlayerWhite) {
                        validSquareIds.push(`${row - i},${col + i}`);
                    }
                    sEastBlocked = true;
                }
            }
        }

        return validSquareIds;
    }

    const getQueenMoves = (row: number, col: number) => {
        return getBishopMoves(row, col).concat(getRookMoves(row, col));
    }

    const getKingMoves = (row: number, col: number) => {
        let validSquareIds: string[] = [];

        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                if (row + i >= 0 && row + i < BOARD_SIZE && col + j >= 0 && col + j < BOARD_SIZE) {
                    if (chessPieceBoard[row + i][col + j] == null || chessPieceBoard[row + i][col + j].isWhite !== props.isPlayerWhite) {
                        validSquareIds.push(`${row + i},${col + j}`);
                    }
                }
            }
        }

        return validSquareIds;
    }

    const getKnightMoves = (row: number, col: number) => {
        const validSquareIds: string[] = [];

        if (row - 2 >= 0) {
            if (col - 1 >= 0) {
                const piece = chessPieceBoard[row - 2][col - 1];
                if (piece == null || piece.isWhite !== props.isPlayerWhite) {
                    validSquareIds.push(`${row - 2},${col - 1}`);
                }
            }
            if (col + 1 < BOARD_SIZE) {
                const piece = chessPieceBoard[row - 2][col + 1];
                if (piece == null || piece.isWhite !== props.isPlayerWhite) {
                    validSquareIds.push(`${row - 2},${col + 1}`);
                }
            }
        }

        if (row - 1 >= 0) {
            if (col - 2 >= 0) {
                const piece = chessPieceBoard[row - 1][col - 2];
                if (piece == null || piece.isWhite !== props.isPlayerWhite) {
                    validSquareIds.push(`${row - 1},${col - 2}`);
                }
            }
            if (col + 2 < BOARD_SIZE) {
                const piece = chessPieceBoard[row - 1][col + 2];
                if (piece == null || piece.isWhite !== props.isPlayerWhite) {
                    validSquareIds.push(`${row - 1},${col + 2}`);
                }
            }
        }

        if (row + 2 < BOARD_SIZE) {
            if (col - 1 >= 0) {
                const piece = chessPieceBoard[row + 2][col - 1];
                if (piece == null || piece.isWhite !== props.isPlayerWhite) {
                    validSquareIds.push(`${row + 2},${col - 1}`);
                }
            }
            if (col + 1 < BOARD_SIZE) {
                const piece = chessPieceBoard[row + 2][col + 1];
                if (piece == null || piece.isWhite !== props.isPlayerWhite) {
                    validSquareIds.push(`${row + 2},${col + 1}`);
                }
            }
        }

        if (row + 1 < BOARD_SIZE) {
            if (col - 2 >= 0) {
                const piece = chessPieceBoard[row + 1][col - 2];
                if (piece == null || piece.isWhite !== props.isPlayerWhite) {
                    validSquareIds.push(`${row + 1},${col - 2}`);
                }
            }
            if (col + 2 < BOARD_SIZE) {
                const piece = chessPieceBoard[row + 1][col + 2];
                if (piece == null || piece.isWhite !== props.isPlayerWhite) {
                    validSquareIds.push(`${row + 1},${col + 2}`);
                }
            }
        }

        return validSquareIds;
    }

    const getPawnMoves = (row: number, col: number, isWhitePawn: boolean) => {

        // if the pawn reaches the last row, its no longer a pawn. No need to check if the move goes past the last rank
        const validSquareIds: string[] = [];

        if (isWhitePawn) {
            if (row < BOARD_SIZE - 1 && chessPieceBoard[row + 1][col] == null) {
                validSquareIds.push(`${row + 1},${col}`);
            }
            if (row < BOARD_SIZE - 1 && col > 0 && chessPieceBoard[row + 1][col - 1] != null && chessPieceBoard[row + 1][col - 1].isWhite !== props.isPlayerWhite) {
                validSquareIds.push(`${row + 1},${col - 1}`);
            }
            if (row < BOARD_SIZE - 1 && col < BOARD_SIZE - 1 && chessPieceBoard[row + 1][col + 1] != null && chessPieceBoard[row + 1][col + 1]?.isWhite !== props.isPlayerWhite) {
                validSquareIds.push(`${row + 1},${col + 1}`);
            }
            if (row === 1) {
                if (chessPieceBoard[row + 2][col] == null) {
                    validSquareIds.push(`${row + 2},${col}`);
                }
            }
        }
        else {
            if (row > 0 && chessPieceBoard[row - 1][col] == null) {
                validSquareIds.push(`${row - 1},${col}`);
            }
            if (row > 0 && col > 0 && chessPieceBoard[row - 1][col - 1] != null && chessPieceBoard[row - 1][col - 1]?.isWhite !== props.isPlayerWhite) {
                validSquareIds.push(`${row - 1},${col - 1}`);
            }
            if (row > 0 && col < BOARD_SIZE - 1 && chessPieceBoard[row - 1][col + 1] != null && chessPieceBoard[row - 1][col + 1]?.isWhite !== props.isPlayerWhite) {
                validSquareIds.push(`${row - 1},${col + 1}`);
            }
            if (row === 6) {
                if (chessPieceBoard[row - 2][col] == null) {
                    validSquareIds.push(`${row - 2},${col}`);
                }
            }
        }

        return validSquareIds;
    }

    const getRookMoves = (row: number, col: number) => {
        const validSquareIds: string[] = [];

        let topBlocked = false;
        let btmBlocked = false;
        let leftBlocked = false;
        let rightBlocked = false;
        for (let i = 1; i < BOARD_SIZE; i++) {
            if (row + i < BOARD_SIZE && !topBlocked) {
                if (chessPieceBoard[row + i][col] == null) {
                    validSquareIds.push(`${row + i},${col}`);
                } else {
                    if (chessPieceBoard[row + i][col].isWhite !== props.isPlayerWhite) {
                        validSquareIds.push(`${row + i},${col}`);
                    }
                    topBlocked = true;
                }
            }

            if (row - i >= 0 && !btmBlocked) {
                if (chessPieceBoard[row - i][col] == null) {
                    validSquareIds.push(`${row - i},${col}`);
                } else {
                    if (chessPieceBoard[row - i][col].isWhite !== props.isPlayerWhite) {
                        validSquareIds.push(`${row - i},${col}`);
                    }
                    btmBlocked = true;
                }
            }

            if (col + i < BOARD_SIZE && !rightBlocked) {
                if (chessPieceBoard[row][col + i] == null) {
                    validSquareIds.push(`${row},${col + i}`);
                } else {
                    if (chessPieceBoard[row][col + i].isWhite !== props.isPlayerWhite) {
                        validSquareIds.push(`${row},${col + i}`);
                    }
                    rightBlocked = true;
                }
            }

            if (col - i >= 0 && !leftBlocked) {
                if (chessPieceBoard[row][col - i] == null) {
                    validSquareIds.push(`${row},${col - i}`);
                } else {
                    if (chessPieceBoard[row][col - i].isWhite !== props.isPlayerWhite) {
                        validSquareIds.push(`${row},${col - i}`);
                    }
                    leftBlocked = true;
                }
            }
        }

        return validSquareIds;
    }

    const parseBoard = (boardStr: string) => {
        let board = [];
        let isWhite = true;
        for (let i = 0; i < boardStr.length; i++) {
            if (boardStr.charAt(i) === "|") {
                isWhite = false;
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
            if (type !== PieceType.PAWN) {
                let pos = convertStringToPosition(boardStr.substring(i + 1, i + 3));
                piece = new ChessPieceInfo(type, isWhite, convertPositionToString(pos.row, pos.col));
                i += 2;
            } else {
                let pos = convertStringToPosition(boardStr.substring(i, i + 2));
                piece = new ChessPieceInfo(type, isWhite, convertPositionToString(pos.row, pos.col));
                i++;
            }

            board.push(piece);
        }

        return board;
    }

    let board = createChessBoardSquares(chessPieceBoard);
    const shouldFlipTable = props.isPlayerWhite;
    if (shouldFlipTable) {
        board.reverse();
    }
    let rowNumber = 0;
    let colNumber = 0;

    let columnLabels = <tr>
        <td>
        </td>
        {board.map(_row => {
            let td = <td>{String.fromCharCode(colNumber + "a".charCodeAt(0))}</td>
            colNumber++;
            return td;
        })}
        <td>
        </td>
    </tr>;

    colNumber = 0;

    let chessTable = <table>
        {columnLabels}
        {board.map(row => {
            let tr = <tr>
                <td>{shouldFlipTable ? (BOARD_SIZE - rowNumber) : rowNumber + 1}</td>
                {row.map(elem => {
                    let td = <td key={rowNumber * BOARD_SIZE + colNumber} id={`${shouldFlipTable ? BOARD_SIZE - (rowNumber + 1) : rowNumber},${colNumber}`}>{elem}</td>;
                    colNumber++;
                    return td;
                })}
                <td>{shouldFlipTable ? (BOARD_SIZE - rowNumber) : rowNumber + 1}</td>
            </tr>;
            rowNumber++;
            colNumber = 0;
            return tr;
        })}
        {columnLabels}
    </table>;

    colNumber = 0;
    return (
        <div
            className="chessboard"
            onMouseMove={(event) =>
                handleMouseMove(event)}>
            {chessTable}
        </div>
    );
};

export default ChessBoard;
