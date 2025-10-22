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
    ready?: boolean
};

type Player = {
    username: string
};

class WebSocketClient {
    private stmpClient_: Client;
    private gameId_?: string;
    private username_?: string;
    private opponentUsername_: string | null;
    private updateGameState?: Function;
    constructor(gameId?: string, username?: string, url?: string, updateGameState?: Function, debug: boolean = true) {
        if (url === undefined) {
            this.stmpClient_ = new Client();
        }

        if (gameId !== undefined) { this.gameId_ = gameId };
        if (username !== undefined) { this.username_ = username };
        if (updateGameState !== undefined) { this.updateGameState = updateGameState };
        this.opponentUsername_ = null;

        this.stmpClient_ = Stomp.client(url!);

        this.stmpClient_.onConnect = (_frame) => this.onConnection();
        this.stmpClient_.onWebSocketError = (event: Error) => this.onWsError(event);
        this.stmpClient_.onDisconnect = (_frame) => this.onDisconnect();
        this.stmpClient_.onWebSocketClose = (_event) => this.onWsClose();
        if (!debug) {
            this.stmpClient_.debug = () => { };
        }
    }

    activate() { this.stmpClient_.activate(); }

    private onConnection() {
        console.log("client connected");

        this.stmpClient_.subscribe(`/game-messaging/info/${this.gameId_}`,
            (message: Message) => this.handleGameInfo(message)
        );

        this.stmpClient_.subscribe(`/user/${this.username_}/${this.gameId_}`,
            (message: Message) => this.handleUserMessaging(message)
        );

        this.stmpClient_.publish({
            destination: `/game-messaging/join/${this.gameId_}`,
            body: JSON.stringify({
                username: this.username_
            })
        });
    }

    private onDisconnect() {
        console.log("socket disconnected");
        this.stmpClient_.deactivate();
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
        this.stmpClient_.publish({
            destination: `/game-messaging/move/${this.gameId_}`,
            body: JSON.stringify({
                username: this.username_,
                move: pieceMove
            })
        })
    }

    private handleUserMessaging(msg: Message) {
        let msgBody: UserMessage = JSON.parse(msg.body);
        if (msgBody.board && this.updateGameState) {
            this.updateGameState(msgBody.board, this.getOpponent(), this.username_);
        }
    }
}

export { WebSocketClient };
