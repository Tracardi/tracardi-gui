import React from "react";
import AutoLoadObjectList from "../elements/lists/AutoLoadObjectList";
import {
    TuiForm,
    TuiFormGroup,
    TuiFormGroupContent,
    TuiFormGroupField,
    TuiFormGroupHeader
} from "../elements/tui/TuiForm";

const Tasks = () => {

    const onLoadRequest = {
        url: `/tasks`,
        method: "GET"
    }

    return <TuiForm style={{margin: 20, width: "calc(100% - 40px)"}}>
        <TuiFormGroup fitHeight={true}>
            <TuiFormGroupHeader header="Scheduled tasks"
                                description="List of scheduled tasks."/>
            <TuiFormGroupContent>
                <TuiFormGroupField>
                    <div style={{overflow: "auto", height: "inherit"}}>
                        <AutoLoadObjectList
                            onLoadRequest={onLoadRequest}
                            label="TASKS"
                            timeField={(row) => [row.event.type]}
                            timeFieldLabel="event.type"
                        />
                    </div>
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
    </TuiForm>
}

export default Tasks;
