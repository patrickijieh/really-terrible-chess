import { useState, type ChangeEvent } from "react";
import "../styles.css";
import ErrorMessage from "./ErrorMessage";
import { InputType, SingleValidator, type FormItem } from "./types";

interface IdMap {
    [key: string]: string
}

export type GenericFormProps = {
    formItems: FormItem[],
    sendRequest: (state: IdMap) => Promise<void>
};

const GenericForm = (props: GenericFormProps) => {
    let idStateMap: IdMap = {};
    let idErrMap: IdMap = {};

    props.formItems.forEach(itm => {
        idStateMap = {
            ...idStateMap,
            [itm.id]: ""
        }
        idErrMap = {
            ...idErrMap,
            [itm.id]: ""
        }
    });

    idErrMap = {
        ...idErrMap,
        form: ""
    };

    const [state, setState] = useState(idStateMap);
    const [errorMsgs, setErrorMsgs] = useState(idErrMap);

    const handleFormChange = (event: ChangeEvent<HTMLInputElement>) => {
        setState({
            ...state,
            [event.target.id]: event.target.value
        });
        setErrorMsgs({
            ...errorMsgs,
            [event.target.id]: "",
            form: ""
        });
    }

    const validateAndSubmit = async () => {
        let canSendRequest: boolean = true;
        let newErrors = {
            ...errorMsgs
        };

        props.formItems.forEach((itm) => {
            if (itm.validator instanceof SingleValidator) {
                const validation = itm.validator.func(state[itm.id]);
                if (!validation.valid) {
                    canSendRequest = false;
                    newErrors = {
                        ...newErrors,
                        [itm.id]: validation.msg!,
                    };
                }
            } else {
                const vals: string[] = []
                itm.validator.ids.forEach((id) => {
                    vals.push(state[id]);
                });

                const validation = itm.validator.func(vals);
                if (!validation.valid) {
                    canSendRequest = false;
                    newErrors = {
                        ...newErrors,
                        [itm.id]: validation.msg!,
                    };
                }
            }
        });

        if (canSendRequest) {
            await props.sendRequest(state);
        } else {
            setErrorMsgs({
                ...newErrors
            });
        }
    }

    const inputTypeToString = (typ: InputType) => {
        switch (typ) {
            case InputType.TEXT:
                return "text";
            case InputType.PASSWORD:
                return "password";
        }
    }

    const formItems = <>
        {props.formItems.map(itm =>
            <div key={itm.id}>
                <div className="form-group">
                    <h4 className="form-label">
                        {itm.title}
                    </h4>
                    <div className="form-item">
                        <input type={inputTypeToString(itm.inputType)} name={itm.id} id={itm.id} className="form-input"
                            value={state[itm.id]}
                            onKeyUp={(event) => {
                                if (event.key === "Enter") { validateAndSubmit() }
                            }}
                            onChange={(event) =>
                                handleFormChange(event)}
                            placeholder={itm.placeholder} />

                    </div>
                </div>
                <ErrorMessage message={errorMsgs[itm.id]} />
            </div>
        )}
    </>;

    return (
        <section className="form">
            <div className="form-body">
                {formItems}
                <button
                    className="common-button btn"
                    onClick={(_e) => { validateAndSubmit() }}>
                    Submit
                </button>
                <ErrorMessage message={errorMsgs.form} />
            </div>
        </section>
    );
};

export default GenericForm;
