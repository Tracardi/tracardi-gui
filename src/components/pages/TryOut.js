import React from "react";
import ListOfDottedInputs from "../elements/forms/ListOfDottedInputs";
import TimeInput from "../elements/forms/inputs/TimeInput";
import IconSelector from "../elements/IconSelector";
import {Button} from "@mui/material";
import DotAccessor from "../elements/forms/inputs/DotAccessor";
import BackgroundTaskProgress from "../elements/misc/BackgroundTaskProgress";
import JsonForm from "../elements/forms/JsonForm";

export default function TryOut() {
    const [v, setV] = React.useState("`profile@`");

    return (<div style={{padding: 10}}>
            <DotAccessor label="E-mail" value={v} onChange={(e) => {
                console.log("READY", e);
                setV(e)
            }}/>
            <Button onClick={() => setV("test")}>xxx</Button>
            <div style={{height: "100%", overflow: "auto"}}>
                <BackgroundTaskProgress taskId="baf6d467-df07-4d94-966a-aac6a034321s"/>
                <IconSelector value="alert" onChange={(ic) => console.log(ic)}/>
                <TimeInput/>
                <ListOfDottedInputs onChange={(x) => console.log(x)}/>
                <JsonForm
                    schema={{
                        title: null,
                        groups: [{
                            name: null,
                            description: null,
                            fields: [{
                                description: "Consent types",
                                id: "consents",
                                name: "Consent types name",
                                required: false,
                                validation: null,
                                component: {
                                    type: "consentTypes",
                                    props: {label: "Consents"}
                                }
                            }]
                        }]
                    }}
                    values={{consents: []}}
                />
            </div>
        </div>
    );
}
