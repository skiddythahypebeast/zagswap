import { type ChangeEvent, useMemo, useState } from "react";

export interface ValidatedString {
    value: string,
    valid: boolean
}

export const useValidatedStringInput = (validator: string | undefined | null, allowEmpty: boolean) => {
    const [value, setValue] = useState<string>('');

    const valid = useMemo(() => {
        if (validator === undefined) {
            return false;
        } else if (validator === null) {
            return true;
        } else if (allowEmpty && value == '') {
            return true;
        } else if (value != '' && new RegExp(validator).test(value)) {
            return true;
        }
        return false;
    }, [value, validator, allowEmpty]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value)
    }

    return { valid, value, handleChange }
}