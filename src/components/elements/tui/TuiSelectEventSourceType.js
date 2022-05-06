import React from "react";
import AutoComplete from "../forms/AutoComplete";

export default function TuiSelectEventSourceType({value, onSetValue, errorMessage=""}) {
    return <AutoComplete
        onlyValueWithOptions={true}
        disabled={false}
        error={errorMessage}
        placeholder="Event source type"
        endpoint={{url:"/event-sources/type/name"}}
        initValue={value}
        onSetValue={onSetValue}
    />
}

export const TuiSelectEventSourceTypeMemo = React.memo(TuiSelectEventSourceType,
    (prev,next) => {
        return prev.value === next.value
    })