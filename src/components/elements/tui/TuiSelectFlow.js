import AutoComplete from "../forms/AutoComplete";
import React from "react";

export default function TuiSelectFlow({value, disabled=false, errorMessage=null, onSetValue=null}) {

    const handleValueSet = (value) => {
        if (onSetValue) {
            onSetValue(value);
        }
    };

    return <AutoComplete
        solo={false}
        disabled={disabled}
        placeholder="Flow name"
        url="/flows/entity"
        error={errorMessage}
        initValue={value}
        onSetValue={handleValueSet}
        onDataLoaded={
            (result) => {
                if (result) {
                    let flows = []
                    for (const flow of result?.data?.result) {
                        console.log(flow)
                        if (typeof flow.name !== "undefined" && typeof flow.id !== "undefined") {
                            flows.push({name: flow.name, id: flow.id})
                        }
                    }
                    return flows
                }
            }
        }/>
}