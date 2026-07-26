import "../styles.css";
import Header from "../component/Header.tsx";
import GenericForm from "../component/GenericForm.tsx";
import {UsernameValidator, PasswordValidator, ConfirmPasswordValidator} from "../component/validators.ts";
import {CompoundValidator, InputType, SingleValidator, type FormItem, type IdMap, type ServerResponse} from "../component/types.ts";

const sendSignupRequest = async (state: IdMap): Promise<ServerResponse> => {
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

const SignupPage = () => {
    document.title = "Really Terrible Chess - Sign Up";
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
            placeholder: "password",
            inputType: InputType.PASSWORD,
            validator: new CompoundValidator(["password", "password-confirm"], ConfirmPasswordValidator)
        }
    ];

    return (
        <>
            <Header home={false}/>
            <div className="content">
                <h1>Really Terrible Chess - Sign Up</h1>
                <GenericForm formItems={formItems} sendRequest={sendSignupRequest} />
            </div>
        </>
    );
};

export default SignupPage;
