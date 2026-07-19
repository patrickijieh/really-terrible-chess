import "../styles.css";

const ErrorMessage = (props: { message: string, isGeneralError: boolean }) => {
    if (!props.message || props.message.length < 1) {
        return <div>
            <p className="error-msg-empty">message</p>
        </div>;
    }

    return (<div>
        <p className={props.isGeneralError ? "general-error-msg" : "error-msg"}>{props.message}</p>
    </div>);
}

export default ErrorMessage;
