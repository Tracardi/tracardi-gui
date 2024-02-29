import React from "react";
import AutoComplete from "../forms/AutoComplete";

function TuiSelectConfigurationType({initValue, onSetValue, errorMessage=""}) {
    return <AutoComplete
        onlyValueWithOptions={true}
        disabled={false}
        error={errorMessage}
        placeholder="Configuration type"
        endpoint={{url:"/configuration-type"}}
        initValue={initValue}
        onSetValue={onSetValue}
    />
}

export const TuiSelectConfigurationTypeMemo = React.memo(TuiSelectConfigurationType,
    (prev,next) => {
        return prev.initValue === next.initValue && prev.errorMessage === next.errorMessage
    })