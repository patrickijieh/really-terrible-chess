import "../styles.css";
import Header from "../component/Header.tsx";
import {type FormItem, type IdMap, InputType, type ServerResponse, SingleValidator} from "../component/types.ts";
import {UsernameValidator} from "../component/validators.ts";
import GenericForm from "../component/GenericForm.tsx";

const sendRoomCreationRequest = async (state: IdMap): Promise<ServerResponse> => {
    const response = await fetch("/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "username": state.username
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
            message: "invalid input. check inputs and try again."
        }
    }

    localStorage.setItem("gameId", data.gameId);
    localStorage.setItem("username", state.username);

    window.location.assign( "/game");
    return {
        ok: response.ok
    }
}

const CreateRoom = () => {
    document.title = "Really Terrible Chess - Create Room";
    const formItems: FormItem[] = [
        {
            id: "username",
            title: "username",
            placeholder: "username",
            inputType: InputType.TEXT,
            validator: new SingleValidator(UsernameValidator)
        }
    ];

    return (
        <>
            <Header home={true}/>
            <div className="content">
                <h1>Really Terrible Chess - Create Room</h1>
                <h3>Creating a new Room</h3>
                <GenericForm formItems={formItems} sendRequest={sendRoomCreationRequest} />
            </div>
        </>
    );
};

export default CreateRoom;
