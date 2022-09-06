import React from "react";
import AutoComplete from "../forms/AutoComplete";

function TuiSelectResourceType({initValue, onSetValue, errorMessage=""}) {
    return <AutoComplete
        onlyValueWithOptions={true}
        disabled={false}
        error={errorMessage}
        placeholder="Resource type"
        endpoint={{url:"/resources/type/name"}}
        initValue={initValue}
        onSetValue={onSetValue}
    />
}

export const TuiSelectResourceTypeMemo = React.memo(TuiSelectResourceType,
    (prev,next) => {
        return prev.initValue === next.initValue
    })