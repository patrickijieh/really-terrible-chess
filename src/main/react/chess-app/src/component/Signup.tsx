import "../styles.css";
import Header from "./Header";
import GenericForm from "./GenericForm";
import {UsernameValidator, PasswordValidator, ConfirmPasswordValidator} from "./validators.ts";
import { CompoundValidator, InputType, SingleValidator, type FormItem, type IdMap } from "./types";

const request = async (state: IdMap): Promise<void> => {
    const response = await fetch("/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "username": state.username,
            "password": state.password
        })
    });
    if (response.ok) {
        console.log("ok");
    }
}

const SignupPage = () => {
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
        {
            id: "password-confirm",
            title: "confirm password",
            placeholder: "confirm password",
            inputType: InputType.PASSWORD,
            validator: new CompoundValidator(["password", "password-confirm"], ConfirmPasswordValidator)
        }
    ];

    return (
        <>
            <Header />
            <GenericForm formItems={formItems} sendRequest={request} />
        </>
    );
};

export default SignupPage;
