import "../styles.css";
import GenericForm from "./GenericForm";
import Header from "./Header";
import {UsernameValidator, PasswordValidator} from "./validators.ts";
import {InputType, SingleValidator, type FormItem, type IdMap} from "./types";

const request = async (state: IdMap): Promise<void> => {
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

    const json = await response.json();
    console.log(json);
}

const LoginPage = () => {
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
            <GenericForm formItems={formItems} sendRequest={request} />
        </>
    );
};

export default LoginPage;
