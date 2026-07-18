import { Stomp, Client, type Message } from "@stomp/stompjs";

type InfoMessage = {
    gameId: string,
    message?: string,
    players?: Player[],
    board?: string,
    ready?: boolean
};

type UserMessage = {
    gameId: string,
    message?: string,
    board?: string,
    ready?: boolean,
    status?: string,
    isPlayerWhite?: boolean
    isWhitesTurn?: boolean
};

type MoveMessage = {
    gameId: string,
    board: string,
    status: string,
    gameState: string
    isWhitesTurn: boolean,
    message?: string
}

type Player = {
    username: string
};

class WebSocketClient {
    private stompClient_: Client;
    private readonly gameId_?: string;
    private readonly username_?: string;
    private opponentUsername_: string | null;
    private readonly updateGameState?: Function;
    constructor(gameId?: string, username?: string, url?: string, updateGameState?: Function, debug: boolean = true) {
        if (url === undefined) {
            this.stompClient_ = new Client();
        }

        if (gameId !== undefined) { this.gameId_ = gameId };
        if (username !== undefined) { this.username_ = username };
        if (updateGameState !== undefined) { this.updateGameState = updateGameState };
        this.opponentUsername_ = null;

        this.stompClient_ = Stomp.client(url!);

        this.stompClient_.onConnect = (_frame) => this.onConnection();
        this.stompClient_.onWebSocketError = (event: Error) => this.onWsError(event);
        this.stompClient_.onDisconnect = (_frame) => this.onDisconnect();
        this.stompClient_.onWebSocketClose = (_event) => this.onWsClose();
        if (!debug) {
            this.stompClient_.debug = () => { };
        }
    }

    activate() { this.stompClient_.activate(); }

    private onConnection() {
        console.log("client connected");

        this.stompClient_.subscribe(`/game-messaging/info/${this.gameId_}`,
            (message: Message) => this.handleGameInfo(message)
        );

        this.stompClient_.subscribe(`/user/${this.username_}/${this.gameId_}`,
            (message: Message) => this.handleUserMessaging(message)
        );

        this.stompClient_.subscribe(`/game-messaging/moves/${this.gameId_}`,
            (message: Message) => this.handleGameMoveMessages(message)
        );

        this.stompClient_.publish({
            destination: `/game-messaging/join/${this.gameId_}`,
            body: JSON.stringify({
                username: this.username_
            })
        });
    }

    private onDisconnect() {
        console.log("socket disconnected");
        this.stompClient_.deactivate();
    }

    private onWsError(_event: Error) {
        console.error("websocket error");
    }

    private onWsClose() {
        console.log("socket closed");
    }

    private handleGameInfo(msg: Message) {
        let msgBody: InfoMessage = JSON.parse(msg.body);
        if (msgBody.players) {
            this.changeOpponent(msgBody.players);
        }
    }

    private handleGameMoveMessages(msg: Message) {
        let msgBody: MoveMessage = JSON.parse(msg.body);
        if (msgBody.board && this.updateGameState) {
            this.updateGameState(msgBody.board, this.getOpponent(), this.username_, null, msgBody.isWhitesTurn, msgBody.gameState);
        }
    }

    private changeOpponent(players: Player[]) {
        players?.forEach(player => {
            if (player.username !== this.username_) {
                this.opponentUsername_ = player.username;
            }
        });
    }

    getOpponent(): string | null {
        return this.opponentUsername_;
    }

    sendMove(pieceMove: string) {
        console.log(pieceMove);
        this.stompClient_.publish({
            destination: `/game-messaging/send-move/${this.gameId_}`,
            body: JSON.stringify({
                username: this.username_,
                move: pieceMove
            })
        })
    }

    private handleUserMessaging(msg: Message) {
        let msgBody: UserMessage = JSON.parse(msg.body);
        if (msgBody.board && this.updateGameState) {
            if (msgBody.isPlayerWhite !== undefined) {
                this.updateGameState(msgBody.board, this.getOpponent(), this.username_, msgBody.isPlayerWhite);
            } else {
                this.updateGameState(msgBody.board, this.getOpponent(), this.username_);
            }
        }
    }
}

export { WebSocketClient };
