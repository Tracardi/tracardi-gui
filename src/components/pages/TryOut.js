import React, {useState} from "react";
import ListOfDottedInputs from "../elements/forms/ListOfDottedInputs";
import TimeInput from "../elements/forms/inputs/TimeInput";
import IconSelector from "../elements/IconSelector";
import DotAccessor from "../elements/forms/inputs/DotAccessor";
import BackgroundTaskProgress from "../elements/misc/BackgroundTaskProgress";
import JsonForm from "../elements/forms/JsonForm";
import TokenInput from "../elements/forms/inputs/TokenInput";
import BoxStyling from "../elements/tui/TuiBoxStyling";
import TimeDifference from "../elements/datepickers/TimeDifference";
import RefInput from "../elements/forms/inputs/RefInput";
import Button from "../elements/forms/Button";
import Chip from "@mui/material/Chip";
import ListOfEventPayloads from "../elements/forms/ListOfEventPayloads";
import TrackerPayloadForm from "../elements/forms/TrackerPayloadForm";
import {AutocompleteQuery} from "../elements/tui/TuiAutocompleteQuery";
import AutoComplete from "../elements/forms/AutoComplete";
import KqlAutoComplete, {Kql} from "../elements/forms/KqlAutoComplete";

export default function TryOut() {
    const [v, setV] = React.useState("`profile@`");
    const [value, setValue] = React.useState("test");
    const [token, setToken] = useState(null)

    const ComplianceRuleDetails = ({value}) => {

        function chips(consents) {
            return consents.map((consent, key) => {
                return <Chip key={key}  size="small" label={consent.name} />
            })
        }

        return <div style={{padding: "10px 7px"}} className="flexLine">{value.action} FILED "{value.field.value}" IF NO CONSENTS <span className="flexLine" style={{marginLeft: 10, gap: 3}}>{chips(value.consents)}</span></div>
    }





    return (<div style={{padding: 10}}>
            <Kql/>
            <div style={{width: 600}}>
                <TrackerPayloadForm
                    // value={value}
                             onChange={(v) => console.log(v)}/>
            </div>

            {/*<DataComplianceSettings*/}
            {/*    value={[{field: {value:"1", ref: true}, consents: [], action: "hash"}, {field: {value:"2", ref: false}, consents: [], action: "nothing"}]}*/}
            {/*    onChange={(v) => console.log(v)}*/}
            {/*/>*/}
            <TimeDifference date={"2022-10-14T14:43:56.591642"}/>
            <RefInput value="123"/>
            <BoxStyling value={{
                margin: {
                    left: 10, top: 10, right: 10, bottom: 10
                },
                padding: {
                    left: 0, top: 0, right: 2, bottom: 200
                },
                color: {
                    background: "rgba(255,255,255,1)",
                    text: "red"
                }
            }}/>
            <div style={{marginBottom: 20}}>

            </div>

            <TokenInput apiKey={value}
                        getTokenUrl={(apiKey) => {
                            return {
                                baseURL: "http://localhost:20000",
                                url: "/api-key/" + apiKey
                            }
                        }}
                        token={token}
                        onTokenChange={(v) => {
                            console.log(v);
                            setToken(v)
                        }}/>
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
