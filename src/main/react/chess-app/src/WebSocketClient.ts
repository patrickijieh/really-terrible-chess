import { Stomp, Client, type Message } from "@stomp/stompjs";

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

        this.stmpClient_.onConnect = (_frame) => this.onConnection();
        this.stmpClient_.onWebSocketError = (event: Error) => this.onWsError(event);
        this.stmpClient_.onDisconnect = (_frame) => this.onDisconnect();
        this.stmpClient_.onWebSocketClose = (_event) => this.onWsClose();
        if (!debug) {
            this.stmpClient_.debug = () => { };
        }
    }

    activate() { this.stmpClient_.activate(); }

    onConnection() {
        console.log("client connected");

        this.stmpClient_.subscribe(`/game-messaging/info/${this.gameId_}`,
            (message: Message) => this.handleGameInfo(message)
        );

        this.stmpClient_.subscribe(`/user/${this.username_}/${this.gameId_}`,
            (message: Message) => this.handleUserMessaging(message)
        )

        this.stmpClient_.publish({
            destination: `/game-messaging/join/${this.gameId_}`,
            body: JSON.stringify({
                name: this.username_
            })
        });
    }

    onDisconnect() {
        console.log("socket disconnected");
        this.stmpClient_.deactivate();
    }

    onWsError(_event: Error) {
        console.error("websocket error");
    }

    onWsClose() {
        console.log("socket closed");
    }

    handleGameInfo(message: Message) {
        console.log(message.body);
    }

    handleUserMessaging(message: Message) {
        console.log(message.body);
    }
}

export { WebSocketClient };
