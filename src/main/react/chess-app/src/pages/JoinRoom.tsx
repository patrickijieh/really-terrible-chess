import "../styles.css";
import Header from "../component/Header.tsx";
import {type FormItem, type IdMap, InputType, type ServerResponse, SingleValidator} from "../component/types.ts";
import {GameIdValidator, UsernameValidator} from "../component/validators.ts";
import GenericForm from "../component/GenericForm.tsx";

const sendRoomJoinRequest = async (state: IdMap): Promise<ServerResponse> => {
    const response = await fetch("/join", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "username": state.username,
            "gameId": state.gameId
        })
    });

    if (!response.ok) {
        return {
            ok: response.ok,
            message: "invalid input."
        };
    }

    let data: { gameId: string };
    try {
        data = await response.json();
    } catch (err) {
        return {
            ok: response.ok,
            message: "invalid input."
        };
    }

    localStorage.setItem("gameId", data.gameId);
    localStorage.setItem("username", state.username);

    window.location.assign( "/game");
    return {
        ok: response.ok
    }
}

const JoinRoom = () => {
    document.title = "Really Terrible Chess - Join Room";
    const formItems: FormItem[] = [
        {
            id: "username",
            title: "username",
            placeholder: "username",
            inputType: InputType.TEXT,
            validator: new SingleValidator(UsernameValidator)
        },
        {
            id: "gameId",
            title: "game id",
            placeholder: "game id",
            inputType: InputType.TEXT,
            validator: new SingleValidator(GameIdValidator)
        },
    ];

    return (
        <>
            <Header home={true}/>
            <div className="content">
                <h1>Really Terrible Chess - Join Room</h1>
                <h3>Join Another Room</h3>
                <GenericForm formItems={formItems} sendRequest={sendRoomJoinRequest} />
            </div>
        </>
    );
};

export default JoinRoom;
