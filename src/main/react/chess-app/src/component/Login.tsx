import "../styles.css";
import GenericForm from "./GenericForm";
import Header from "./Header";
import {UsernameValidator, PasswordValidator} from "./validators.ts";
import {InputType, SingleValidator, type FormItem, type IdMap, type ServerResponse} from "./types";

const sendLoginRequest = async (state: IdMap): Promise<ServerResponse> => {
    const response = await fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "username": state.username,
            "password": state.password
        })
    });

    if (!response.ok) {
        return {
            ok: response.ok,
            message: "invalid input"
        }
    }


    return {
        ok: response.ok
    };
}

const LoginPage = () => {
    document.title = "Really Terrible Chess - Login";
    const formItems: FormItem[] = [
        {
            id: "username",
            title: "username",
            placeholder: "username",
            inputType: InputType.TEXT,
            validator: new SingleValidator(UsernameValidator)
        },
        {
            id: "password",
            title: "password",
            placeholder: "password",
            inputType: InputType.PASSWORD,
            validator: new SingleValidator(PasswordValidator)
        },
    ];

    return (
        <>
            <Header />
            <div className="content">
                <h1>Really Terrible Chess - Login</h1>
                <GenericForm formItems={formItems} sendRequest={sendLoginRequest} />
            </div>
        </>
    );
};

export default LoginPage;
