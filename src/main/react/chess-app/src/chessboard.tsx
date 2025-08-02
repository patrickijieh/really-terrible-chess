import "./styles.css";

const ChessBoard = () => {
    return (
        <div>
            {createChessBoard()}
        </div>
    );
};

const createChessBoard = () => {
    const board = [];
    for (let row = 8; row > 0; row--) {
        let column = [];
        for (let col = 0; col < 8; col++) {
            let charCode = "a".charCodeAt(0);
            column.push("" + String.fromCharCode(charCode + col) + row);
        }
        board.push(column);
    }

    let row_n = 1, col_n = 0;
    return (
        <table>
            {board.map(row => {
                row_n++;
                return (<tr>
                    {row.map(pos => {
                        return <td key={pos} className={"cell " + ((row_n + col_n++) % 2 == 0 ? "cell-white" : "cell-black")}>{pos}</td>
                    })}
                </tr>)
            }
            )}
        </table>
    );
};

export default ChessBoard;
