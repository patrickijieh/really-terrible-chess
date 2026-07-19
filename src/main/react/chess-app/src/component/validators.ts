const UsernameValidator = (username: string) => {
    if (username.length < 3 || username.length > 15) {
        return {
            valid: false,
            msg: "username must be between 3 and 15 characters long."
        };
    }

    return {
        valid: true
    }
}

const PasswordValidator = (passwd: string) => {
    if (passwd.length < 8 || passwd.length > 32) {
        return {
            valid: false,
            msg: "password must be between 8 and 32 characters long."
        };
    }

    return {
        valid: true
    }
}

const ConfirmPasswordValidator = (passwords: string[]) => {
    const password = passwords[0];
    const confirmPassword = passwords[1];
    if (confirmPassword !== password) {
        return {
            valid: false,
            msg: "both passwords must match!"
        }
    }

    return {
        valid: true
    }
}

const GameIdValidator = (gameId: string) => {
    if (gameId.length < 12 || gameId.length > 16) {
        return {
            valid: false,
            msg: "game id is invalid!"
        }
    }

    return {
        valid: true
    }
}

export { UsernameValidator, PasswordValidator, ConfirmPasswordValidator, GameIdValidator};