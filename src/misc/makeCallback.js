const makeCallback = (callbackProp, overrideValue) => (event) => {
    if (typeof callbackProp === 'function') {
        const { value } = event.currentTarget;

        return callbackProp(event, overrideValue === undefined ? value : overrideValue);
    }

    return undefined;
};

export default makeCallback;