import React from "react";
import {
    TuiForm,
    TuiFormGroup,
    TuiFormGroupContent,
    TuiFormGroupField,
    TuiFormGroupHeader
} from "../elements/tui/TuiForm";
import AutoLoadLogList from "../elements/lists/AutoLoadLogList";

const Logs = () => {

    const onLoadRequest = {
        url: `/logs`,
        method: "GET"
    }

    return <TuiForm style={{margin: 20, width: "calc(100% - 40px)", height: "calc(100% - 40px)"}}>
        <TuiFormGroup fitHeight={true}>
            <TuiFormGroupHeader header="Tracardi logs" description="List of logged operations."/>
            <TuiFormGroupContent>
                <TuiFormGroupField>
                    <div style={{overflow: "auto", height: "inherit"}}>
                        <AutoLoadLogList
                            onLoadRequest={onLoadRequest}
                            label="LOGS"
                        />
                    </div>
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
    </TuiForm>
}

export default Logs;
