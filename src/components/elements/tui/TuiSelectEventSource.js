import AutoComplete from "../forms/AutoComplete";
import React from "react";


export function TuiSelectEventSource({value = null, disabled = false, errorMessage = null, onSetValue = null}) {

    const handleValueSet = (value) => {
        if (onSetValue) {
            onSetValue(value);
        }
    };

    return <div>
        <AutoComplete disabled={disabled}
                      onlyValueWithOptions={true}
                      placeholder="Event source"
                      endpoint={{url:"/event-sources/entity"}}
                      initValue={value}
                      error={errorMessage}
                      onSetValue={handleValueSet}
        />
    </div>
}
