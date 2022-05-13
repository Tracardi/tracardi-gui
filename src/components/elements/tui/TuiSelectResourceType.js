import React from "react";
import AutoComplete from "../forms/AutoComplete";

function TuiSelectResourceType({value, onSetValue, errorMessage=""}) {
    return <AutoComplete
        onlyValueWithOptions={true}
        disabled={false}
        error={errorMessage}
        placeholder="Resource type"
        endpoint={{url:"/resources/type/name"}}
        initValue={value}
        onSetValue={onSetValue}
    />
}

export const TuiSelectResourceTypeMemo = React.memo(TuiSelectResourceType,
    (prev,next) => {
        return prev.value === next.value
    })