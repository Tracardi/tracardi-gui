import {useEffect, useState} from 'react';
import {isEmptyObjectOrNull} from "./typeChecking";

export function useObjectState({name, value, defaultValue, onChange, onSubmit}) {

    const [data, setData] = useState(null);

    useEffect(() => {
        return () => {
            setData(null)
        }
    }, [])

    const handleStateChange = (newState) => {
        setData(newState)
        if(onChange instanceof Function) {
            onChange(newState)
        }
    }

    const update = (changedValue) => {
        let newValue;
        if(data === null) {
            if(value) {
                newValue = {...value, ...changedValue}
            } else {
                newValue = {...defaultValue, ...changedValue}
            }
        } else {
            newValue = {...data, ...changedValue}
        }
        handleStateChange(newValue)
        return newValue
    }

    const get = () => {
        return data||value||defaultValue
    }

    const set = (key, changedValue) => {

        let newValue;
        if(data === null) {
            if(value) {
                newValue = {...value, [key]:changedValue}
            } else {
                newValue = {...defaultValue, [key]:changedValue}
            }
        } else {
            newValue = {...data, [key]:changedValue}
        }

        handleStateChange(newValue)

        return newValue
    }

    const submit = (data) => {
        if(onSubmit instanceof Function) {
            if(isEmptyObjectOrNull(data)) {
                onSubmit(get())
            } else {
                onSubmit(data)
            }
        }
    }

    const del = (key) => {

    }

    const reset = () => {
        handleStateChange(null)
    }

    return {set, get, update, del, submit, reset}
}