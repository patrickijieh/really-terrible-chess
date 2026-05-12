import "../styles.css";

const GameOverModal = (props: { show: boolean, isWinner: boolean, opponentName: string }) => {

    return props.show ? <div className="modal">
        <div className="modal-content">
            <p>{`${props.isWinner ? "YOU WON!" : "YOU LOST!"}`}</p>
            <p>{`You ${props.isWinner ? "won" : "lost"} against ${props.opponentName}!`}</p>
        </div>
    </div> :
        <></>;
};

export default GameOverModal;
