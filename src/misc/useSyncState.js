import { useState } from 'react';

export function useObjectState(initialValue, onChange) {
    const [data, setData] = useState(null);

    const set = (newState) => {
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

    return {set, get}
}