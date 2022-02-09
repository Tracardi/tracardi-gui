import React from "react";
import AutoComplete from "../forms/AutoComplete";

function TuiSelectResourceType({value, onSetValue, errorMessage=""}) {
    return <AutoComplete
        solo={false}
        disabled={false}
        error={errorMessage}
        placeholder="Resource type"
        url="/resources/type/name"
        initValue={value}
        onSetValue={onSetValue}
    />
}

export const TuiSelectResourceTypeMemo = React.memo(TuiSelectResourceType,
    (prev,next) => {
        return prev.value === next.value
    })