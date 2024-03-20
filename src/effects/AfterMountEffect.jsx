import { useEffect, useRef } from 'react';

const useAfterMountEffect = (func, deps) => {
    const didMount = useRef(false);

    useEffect(() => {
        if (didMount.current) func();
        else didMount.current = true;
    },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        deps);
}

export default useAfterMountEffect;