import React, {useEffect, useState} from "react";
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
import TrackerPayloadForm from "../elements/forms/TrackerPayloadForm";
import KqlAutoComplete from "../elements/forms/KqlAutoComplete";
import ListOfForms from "../elements/forms/ListOfForms";
import Switch from "@mui/material/Switch";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepContent from "@mui/material/StepContent";
import StepLabel from "@mui/material/StepLabel";
import Paper from "@mui/material/Paper";
import NoData from "../elements/misc/NoData";
import EventToProfileCopy from "../elements/forms/EventToProfileCopy";
import {EventTypeFlowsAC} from "../elements/forms/inputs/EventTypeFlowsAC";
import Funnel from "../elements/charts/Funnel";


function Journey({width, height}) {
    return <div style={{padding: 10}}>
        <div style={{display: "flex"}}>
            <Funnel width={width} height={height}/>
            <div style={{display: "flex",
                flexDirection: "column",
                alignItems: "start",
                flex: "1 1",
                justifyContent: "space-evenly",
                paddingLeft: 10,
                height: height
            }}>
                <div style={{display: "flex", width: "100%", height: "100%", borderBottom: "1px dashed #999"}}>
                    <div style={{color: "gray", display: "flex", width:200, textAlign: "center", fontSize: 12}}>Customers become aware of your company and its offerings as they seek solutions to their problems or needs.</div>
                    <div></div>
                </div>
                <div style={{display: "flex", width: "100%", height: "100%", borderBottom: "1px dashed #999"}}>
                    <div style={{color: "gray", display: "flex", width:200, textAlign: "center", fontSize: 12}}>Customers evaluate your company against competitors, seeking deeper understanding and proof points to determine the best choice.</div>
                    <div></div>
                </div>
                <div style={{display: "flex", width: "100%", height: "100%", borderBottom: "1px dashed #999"}}>
                    <div style={{color: "gray", display: "flex", width:200, textAlign: "center", fontSize: 12}}>Customers decide to purchase your product or service, and you must simplify the process for them with a user-friendly website, clear pricing, and multiple payment options.</div>
                    <div>

                    </div>
                </div>
                <div style={{display: "flex", width: "100%", height: "100%", borderBottom: "1px dashed #999"}}>
                    <div style={{color: "gray", display: "flex", width:200, textAlign: "center", fontSize: 12}}>
                        Nurture strong relationships with customers through exceptional service, personalized offers, and ongoing engagement for repeat business.
                    </div>
                    <div>

                    </div>

                </div>
                <div style={{display: "flex", width: "100%", height: "100%"}}>
                    <div style={{color: "gray", width:200, textAlign: "center", fontSize: 12}}>Loyalty turns into advocacy as satisfied customers become brand advocates, spreading positive word-of-mouth and attracting new customers.</div>
                    <div></div>
                </div>
            </div>
        </div>
    </div>
}

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


    const FRM = ({value: _value, onChange}) => {

        const [value, setValue] = useState(_value)

        function handleChange(e) {
            console.log(e.target.checked)
            setValue(e.target.checked)
            onChange(e.target.checked)
        }
        return <>
            <Checkbox checked={value} onChange={handleChange}/>
            <Switch checked={value} onChange={handleChange}/>
            </>
    }

    const Routing = () => {
        return (
            <Box sx={{ maxWidth: 400 }}>
                <Stepper orientation="vertical">
                    <Step key={"event-source"} active={true}>
                            <StepLabel optional="Collected from event source">Event source</StepLabel>
                            <StepContent>
                                <Paper style={{padding: 20}}>
                                    <h3>Desc</h3>
                                    <Box sx={{ mb: 2 }}>
                                        sss
                                    </Box>
                                </Paper>

                            </StepContent>
                    </Step>
                    <Step key={"validation"} active={true}>
                        <StepLabel optional="Event data validation">
                            Data Validation
                        </StepLabel>
                        <StepContent>
                            <Paper>
                                <NoData header="No validation set"/>
                            </Paper>
                        </StepContent>
                    </Step>
                    <Step key={"reshaping"} active={true}>
                        <StepLabel optional="Event data reshaping">
                            Reshaping
                        </StepLabel>
                        <StepContent>
                            <Paper>
                                <NoData header="No reshaping set"/>
                            </Paper>
                        </StepContent>
                    </Step>
                    <Step key={"indexing"} active={true}>
                        <StepLabel optional="Event indexing">
                            Indexing
                        </StepLabel>
                        <StepContent>
                            <Paper>
                                <NoData header="No indexing set"/>
                            </Paper>
                        </StepContent>
                    </Step>
                    <Step key={"coping"} active={true}>
                        <StepLabel optional="How the date is transferred form event to profile">
                            Event to profile
                        </StepLabel>
                        <StepContent>
                            <Paper>
                                <NoData header="No coping of data set"/>
                            </Paper>
                        </StepContent>
                    </Step>
                </Stepper>
            </Box>)
    }
    //value={{value:"123", ref:true}} autocomplete="profile"
    return (
        <div>
        <Journey width={300} height={600}/>
            <EventTypeFlowsAC eventType={"page-view"}/>
            <EventToProfileCopy onChange={v => console.log("fields", v)}/>
            <RefInput label="sss" onChange={(v)=>console.log(v)} errorMessage="ssss" fullWidth/>
            <DotAccessor label="xxx"/>
            <Routing/>
            <KqlAutoComplete onChange={(v) => console.log(v)}/>
            <FRM value={false} onChange={(v) => console.log("c", v)}/>
            <div style={{width: 600}}>
                <TrackerPayloadForm
                    // value={value}
                             onChange={(v) => console.log(v)}/>
            </div>
            {
                React.createElement(
                    FRM,
                    {value: true, onChange: (value) => console.log("key", value)},
                    null
                )
            }
            {/*<DataComplianceSettings*/}
            {/*    value={[{field: {value:"1", ref: true}, consents: [], action: "hash"}, {field: {value:"2", ref: false}, consents: [], action: "nothing"}]}*/}
            {/*    onChange={(v) => console.log(v)}*/}
            {/*/>*/}
            --------
            <ListOfForms
                form={FRM}
                defaultFormValue={true}
            />
            <TimeDifference date={"2022-10-14T14:43:56.591642"}/>

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
