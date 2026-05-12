import { PieceType, PromotionTableProps, type PromotionState } from "./types";
import "../../styles.css";
import ChessPiece from "./ChessPiece";

const PromotionTable = (props: PromotionTableProps) => {
    const startingSquare = document.getElementById(`${props.promotionState.newRow},${props.promotionState.newCol}`);
    const table = document.getElementById("table")!;
    let topOffset = startingSquare ? startingSquare.offsetTop + table.offsetTop : 0;
    let leftOffset = startingSquare ? startingSquare.offsetLeft + table.offsetLeft : 0;

    let validPromotions: PieceType[] = [];

    // fallthroughs are intentional :)
    switch (props.promotionState.type) {
        case PieceType.PAWN:
            validPromotions.push(PieceType.KNIGHT);
        case PieceType.KNIGHT:
            validPromotions.push(PieceType.BISHOP);
            validPromotions.push(PieceType.ROOK);
        case PieceType.BISHOP:
            validPromotions.push(PieceType.QUEEN);
            break;
        case PieceType.ROOK:
            validPromotions.push(PieceType.QUEEN);
            break;
        default:
            break;
    }

    // TODO : add cancel/none option (X)

    let key = 0;
    return <div className="promotion-table" style={{ top: `${topOffset + 1}px`, left: `${leftOffset + 1}px` }}>

        {props.promotionState.type != PieceType.PAWN ?
            <PromotionSquare typ={PieceType.NONE} isWhite={props.isWhite} callback={props.promotionCallback} promotionState={props.promotionState} /> :
            <></>
        }
        {validPromotions.map(type => <div key={key++}>
            <PromotionSquare typ={type} isWhite={props.isWhite} callback={props.promotionCallback} promotionState={props.promotionState} />
        </div>
        )}
    </div>;
};

const PromotionSquare = (props: { typ: PieceType, isWhite: boolean, callback: Function, promotionState: PromotionState }) => {
    return <div className="cell cell-promotion" onClick={(_e) =>
        props.callback(props.typ, props.promotionState)}>
        <ChessPiece type={props.typ} isWhite={props.isWhite} draggable={false} />
    </div>;
};

export default PromotionTable;
