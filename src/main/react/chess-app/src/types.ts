import { Stomp, Client, type Message } from "@stomp/stompjs";

type GameInfo = {
    gameId: string
};

class ChessPiece {
    private readonly type_: ChessPieceType;
    private readonly isWhite_: boolean;
    private readonly pos_: string;
    constructor(type: ChessPieceType, isWhite: boolean, pos: string) {
        this.isWhite_ = isWhite;
        this.type_ = type;
        this.pos_ = pos;
    }

    get type() {
        return this.type_;
    }

    get isWhite() {
        return this.isWhite_;
    }

    get pos() {
        return this.pos_;
    }
}

enum ChessPieceType {
    PAWN = "PAWN",
    KNIGHT = "KNIGHT",
    BISHOP = "BISHOP",
    ROOK = "ROOK",
    QUEEN = "QUEEN",
    KING = "KING"
}

class WebSocketClient {
    private stmpClient_: Client;
    private gameId_?: String;
    private username_?: String;
    constructor(gameId?: string, username?: string, url?: string, debug: boolean = true) {
        if (url === undefined) {
            this.stmpClient_ = new Client();
        }

        if (gameId !== undefined) { this.gameId_ = gameId };
        if (username !== undefined) { this.username_ = username };

        this.stmpClient_ = Stomp.client(url!);

        this.stmpClient_.onConnect = (_frame) => this.on_connection();
        this.stmpClient_.onWebSocketError = (event: Error) => this.on_ws_error(event);
        this.stmpClient_.onDisconnect = (_frame) => this.on_disconnect();
        this.stmpClient_.onWebSocketClose = (_event) => this.on_disconnect();
        if (!debug) {
            this.stmpClient_.debug = () => { };
        }
    }

    activate() { this.stmpClient_.activate(); }

    on_connection() {
        console.log("client connected");

        this.stmpClient_.subscribe(`/game-messaging/info/${this.gameId_}`,
            (message: Message) => this.handle_game_info(message)
        );

        this.stmpClient_.publish({
            destination: `/game-messaging/join/${this.gameId_}`,
            body: JSON.stringify({
                name: this.username_
            })
        });
    }

    on_disconnect() {
        console.log("socket disconnected");
        this.stmpClient_.deactivate();
    }

    on_ws_error(_event: Error) {
        console.error("websocket error");
    }

    handle_game_info(message: Message) {
        console.log(message.body);
    }
}

export type { GameInfo };
export { WebSocketClient, ChessPieceType, ChessPiece };
