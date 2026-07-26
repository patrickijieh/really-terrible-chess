import "../styles.css";
import GenericForm from "../component/GenericForm.tsx";
import Header from "../component/Header.tsx";
import {UsernameValidator, PasswordValidator} from "../component/validators.ts";
import {InputType, SingleValidator, type FormItem, type IdMap, type ServerResponse} from "../component/types.ts";

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

    window.location.assign("/");
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
            <Header home={false}/>
            <div className="content">
                <h1>Really Terrible Chess - Login</h1>
                <GenericForm formItems={formItems} sendRequest={sendLoginRequest} />
            </div>
        </>
    );
};

export default LoginPage;
