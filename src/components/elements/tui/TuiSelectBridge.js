import AutoComplete from "../forms/AutoComplete";
import React from "react";


export function TuiSelectBridge({
                                         value = null,
                                         disabled = false,
                                         errorMessage = null,
                                         onSetValue = null,
                                         fullWidth = false,
                                     }) {

    const handleValueSet = (value) => {
        if (onSetValue) {
            onSetValue(value);
        }
    };

    return <div>
        <AutoComplete disabled={disabled}
                      onlyValueWithOptions={true}
                      placeholder="Data bridge"
                      endpoint={{url: "/bridges/entity"}}
                      initValue={value}
                      error={errorMessage}
                      fullWidth={fullWidth}
                      onSetValue={handleValueSet}
        />
    </div>
}
