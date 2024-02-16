import { useState, useEffect } from 'react';

export function useSyncState(initialValue) {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    return [value, setValue];
}