import React from "react";
import AutoLoadObjectList from "../elements/lists/AutoLoadObjectList";
import {
    TuiForm,
    TuiFormGroup,
    TuiFormGroupContent,
    TuiFormGroupField,
    TuiFormGroupHeader
} from "../elements/tui/TuiForm";
import { makeUtcStringTzAware } from "../../misc/converters";

const Instances = () => {

    const onLoadRequest = {
        url: `/instances`,
        method: "GET"
    }

    return <TuiForm style={{margin: 20, width: "calc(100% - 40px)", height: "calc(100% - 40px)"}}>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Running instances of Tracardi" description="List of running workers of tracardi API."/>
            <TuiFormGroupContent>
                <TuiFormGroupField>
                    <div style={{height: "inherit"}}>
                        <AutoLoadObjectList
                            onLoadRequest={onLoadRequest}
                            label="INSTANCES"
                            timeField={(row) => [makeUtcStringTzAware(row.timestamp)]}
                            timeFieldLabel="Timestamp"
                        />
                    </div>
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
    </TuiForm>
}

export default Instances;
