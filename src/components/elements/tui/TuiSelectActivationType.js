import React from "react";
import AutoComplete from "../forms/AutoComplete";

function TuiSelectActivationType({initValue, onChange, errorMessage=""}) {
    return <AutoComplete
        onlyValueWithOptions={true}
        disabled={false}
        error={errorMessage}
        placeholder="Activation type"
        endpoint={{url:"/activation-type"}}
        initValue={initValue}
        onSetValue={onChange}
    />
}

export const TuiSelectActivationTypeMemo = React.memo(TuiSelectActivationType,
    (prev,next) => {
        return prev.initValue === next.initValue && prev.errorMessage === next.errorMessage
    })