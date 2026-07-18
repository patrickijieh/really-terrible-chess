enum InputType {
    TEXT,
    PASSWORD
}

type FormItem = {
    id: string,
    title: string,
    placeholder: string,
    inputType: InputType,
    validator: SingleValidator | CompoundValidator
};

interface IdMap {
    [key: string]: string
}

class SingleValidator {
    func: (str: string) => { valid: boolean, msg?: string }
    constructor(func: (str: string) => { valid: boolean, msg?: string }) {
        this.func = func;
    }
}

class CompoundValidator {
    ids: string[];
    func: (strings: string[]) => { valid: boolean, msg?: string }
    constructor(ids: string[], func: (strings: string[]) => { valid: boolean, msg?: string }) {
        this.ids = ids;
        this.func = func;
    }
}

export { InputType, SingleValidator, CompoundValidator, type FormItem, type IdMap };
