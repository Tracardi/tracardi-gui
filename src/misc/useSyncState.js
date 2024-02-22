import { useState } from 'react';

export function useObjectState(initialValue, onChange, onSubmit) {
    const [data, setData] = useState(null);

    const update = (newState) => {
        let value;
        if(data === null) {
            value = {...initialValue, ...newState}
        } else {
            value = {...data, ...newState}
        }
        setData(value)
        if(onChange instanceof Function) {
            onChange(value)
        }
    }

    const get = () => {
        return data||initialValue
    }

    const set = (key, newValue) => {
        let value = get();
        value[key] = newValue
        setData(value)

        if(onChange instanceof Function) {
            onChange(value)
        }
    }

    const submit = () => {
        if(onSubmit instanceof Function) {
            onSubmit(get())
        }
    }

    const del = (key) => {

    }

    const reset = () => {
        setData(null)
    }

    return {set, get, update, del, submit, reset}
}