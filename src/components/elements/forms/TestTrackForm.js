import React, {useState} from "react";
import {useRequest} from "../../../remote_api/requestClient";
import useTheme from "@mui/material/styles/useTheme";
import {getEventTypePredefinedProps} from "../../../remote_api/endpoints/event";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import TextField from "@mui/material/TextField";
import Button from "./Button";
import TuiColumnsFlex from "../tui/TuiColumnsFlex";
import TuiTopHeaderWrapper from "../tui/TuiTopHeaderWrapper";
import {TuiSelectEventSource} from "../tui/TuiSelectEventSource";
import TuiSelectEventType from "../tui/TuiSelectEventType";
import BoolInput from "./BoolInput";
import Tabs, {TabCase} from "../tabs/Tabs";
import JsonEditor from "../editors/JsonEditor";
import InputAdornment from "@mui/material/InputAdornment";
import Tag from "../misc/Tag";
import Grid from "@mui/material/Grid";

export default function TestTrackForm({eventType, sxOnly = false}) {

    const defaultRequest = {
        "source": {
            "id": ""
        },
        "profile": {
            "id": ""
        },
        "session": {
            "id": ""
        },
        "events": [
            {
                "options": {"async": true},
                "type": eventType || "",
                "properties": {}
            }
        ],
        "context": {}
    }

    const exampleContext = {
        "context": {
            "time": {
                "local": "2024-02-15T00:07:03.364Z",
                "tz": "Europe/Warsaw"
            },
            "device": {
                "gpu": {
                    "vendor": {
                        "id": 37445,
                        "name": "NVIDIA Corporation"
                    },
                    "renderer": {
                        "id": 37446,
                        "renderer": "NVIDIA GeForce GTX 980/PCIe/SSE2"
                    }
                }
            },
            "browser": {
                "local": {
                    "browser": {
                        "name": "firefox",
                        "engine": "Gecko",
                        "appVersion": "5.0 (X11)",
                        "userAgent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:122.0) Gecko/20100101 Firefox/122.0",
                        "language": "en-US",
                        "onLine": true,
                        "javaEnabled": false,
                        "cookieEnabled": true
                    },
                    "device": {
                        "platform": "Linux x86_64"
                    }
                }
            },
            "screen": {
                "local": {
                    "width": 2133,
                    "height": 1200,
                    "innerWidth": 2133,
                    "innerHeight": 710,
                    "availWidth": 2133,
                    "availHeight": 1178,
                    "colorDepth": 24,
                    "pixelDepth": 24,
                    "orientation": "landscape-primary"
                }
            },
            "location": {
                "country": {
                    "name": "Poland",
                    "code": "PL"
                },
                "city": "Warsaw",
                "county": "Mazovia",
                "latitude": 52.1349,
                "longitude": 18.1894,
                "ip": "45.1.25.6"
            }
        }
    }

    const [data, setData] = useState({
        name: "",
        session: "",
        profile: "",
        source: {id: "", name: ""},
        event_type: {id: eventType||"", name: eventType||""},
        properties: "{}",
        async: true,
        context: "{}",
        request: JSON.stringify(defaultRequest, null, " "),
        response: ""
    })

    const parse = (data) => {
        try {
            return JSON.parse(data)
        } catch (e) {
            return null
        }
    }

    const getRequest = (init) => {
        return {
            "source": {
                "id": init?.source?.id || ""
            },
            "profile": {
                "id": init?.profile || ""
            },
            "session": {
                "id": init?.session || ""
            },
            "events": [
                {
                    "options": {"async": init?.async},
                    "type": init?.event_type?.id || "",
                    "properties": parse(init?.properties) || {}
                }
            ],
            "context": parse(init?.context) || {}
        }
    }
    const {request} = useRequest()
    const theme = useTheme()

    const handleChange = (v) => {
        const init ={...data, ...v}
        const request = getRequest(init)
        setData({...data, ...v, request: JSON.stringify(request, null, " ") })
    }

    const handleGetProperties = async (eventType) => {
        try {
            const data = await request(getEventTypePredefinedProps(eventType), true)
            console.log(data)
            if (data && 'properties' in data) {
                handleChange({properties: JSON.stringify(data['properties'], null, " ")})
            }
        } catch (e) {
            console.error(e)
        }

    }

    const handleRequest = async () => {
        try {

            const response = await request({
                    url: '/track',
                    method: 'post',
                    data: parse(data.request)
                },
                true)

            if (response) {
                setData({...data, response: JSON.stringify(response, null, " ")})
            }
        } catch (e) {
            setData({...data, response: JSON.stringify(e?.response?.data, null, " ")})
        } finally {
        }
    }

    const handleSave = () => {
        console.log(data)
    }

    return <Grid container spacing={2}>
        <Grid item xs={12} lg={sxOnly ? 12 : 6}>
            <TuiForm style={{margin: "20px 0 20px 0"}}>
                <TuiFormGroup>
                    <TuiFormGroupContent>
                        <div style={{display: "flex"}}>
                            <TextField label="Name"
                                       value={data?.name}
                                       variant="outlined"
                                       size="small"
                                       fullWidth
                                       onChange={(e) => handleChange({name: e.target.value})}
                            /><Button label="Save"/>
                        </div>
                    </TuiFormGroupContent>
                </TuiFormGroup>
                <TuiFormGroup>
                    <TuiFormGroupHeader description="Only REST API can be testes with this tool."/>
                    <TuiFormGroupContent>

                        <TuiFormGroupField style={{marginBottom: 20}}>
                            <TuiColumnsFlex width={250}>
                                <TuiTopHeaderWrapper>
                                    <TuiSelectEventSource
                                        value={data?.source}
                                        onSetValue={v=>handleChange({source: v})}
                                        type="rest"
                                        width={250}
                                    />
                                </TuiTopHeaderWrapper>
                                <TuiTopHeaderWrapper>
                                    <TuiSelectEventType
                                        value={data?.event_type}
                                        label="Event type"
                                        onlyValueWithOptions={false}
                                        onSetValue={v=>handleChange({event_type: v})}
                                        width={250}
                                    />
                                </TuiTopHeaderWrapper>
                            </TuiColumnsFlex>
                        </TuiFormGroupField>

                        <TuiFormGroupField>
                            <TuiColumnsFlex width={250}>
                                <TuiTopHeaderWrapper>
                                    <TextField label="Session"
                                               value={data?.session}
                                               variant="outlined"
                                               size="small"
                                               fullWidth
                                               helperText="If you know profile id leave session empty. Random session will be generated."
                                               onChange={(e) => handleChange({session: e.target.value})}/>
                                </TuiTopHeaderWrapper>
                                <TuiTopHeaderWrapper>
                                    <TextField label="Profile"
                                               value={data?.profile}
                                               variant="outlined"
                                               size="small"
                                               fullWidth
                                               helperText="Profile must match session, if you do now know profile id leave it empty"
                                               onChange={(e) => handleChange({profile: e.target.value})}
                                    />
                                </TuiTopHeaderWrapper>
                            </TuiColumnsFlex>
                        </TuiFormGroupField>

                        <TuiFormGroupField>
                            <BoolInput label="Async event storing" value={data?.sync}
                                       onChange={v => handleChange({async: v})}/>
                        </TuiFormGroupField>

                        <TuiFormGroupContent>
                            <Tabs
                                tabs={["Properties", "Context"]}
                                tabsStyle={{backgroundColor: theme.palette.background.paper, marginTop: 20}}
                            >
                                <TabCase id={0}>
                                    <fieldset style={{marginTop: 10}}>
                                        <legend>Properties</legend>
                                        <JsonEditor value={data?.properties}
                                                    onChange={v => handleChange({properties: v})}
                                                    height="350px"/>
                                        <Button label="Get predefined properties"
                                                size="small"
                                                onClick={() => handleGetProperties(data?.event_type?.id)}/>
                                        <Button label="Clean properties"
                                                size="small"
                                                onClick={()=>handleChange({properties: JSON.stringify({}, null, " ")})}/>
                                    </fieldset>
                                </TabCase>
                                <TabCase id={1}>
                                    <fieldset style={{marginTop: 10}}>
                                        <legend>Context</legend>
                                        <JsonEditor value={data?.context} onChange={v => handleChange({context: v})}
                                                    height="350px"/>
                                        <Button label="Get example context"
                                                size="small"
                                                onClick={()=>handleChange({context: JSON.stringify(exampleContext, null, " ")})}/>
                                        <Button label="Clean context"
                                                size="small"
                                                onClick={()=>handleChange({context: JSON.stringify({}, null, " ")})}/>
                                    </fieldset>
                                </TabCase>
                            </Tabs>
                        </TuiFormGroupContent>
                    </TuiFormGroupContent>
                </TuiFormGroup>
            </TuiForm>
        </Grid>
        <Grid item xs={12} lg={sxOnly ? 12 : 6}>
            <TuiForm style={{margin: "20px 0 20px 0"}}>
                <TuiFormGroup>
                    <TuiFormGroupContent>
                        <div style={{display: "flex"}}>
                            <TextField
                                value="/track"
                                label="API Endpoint"
                                disabled={true}
                                fullWidth
                                size="small"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Tag>POST</Tag>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Button label="Request" onClick={handleRequest}/>
                        </div>
                        <Tabs
                            tabs={["Request", "Response"]}
                            tabsStyle={{backgroundColor: theme.palette.background.paper, marginTop: 20}}
                        >
                            <TabCase id={0}>
                                <fieldset style={{marginTop: 20}}>
                                    <legend>Request</legend>
                                    <JsonEditor value={data?.request} onChange={v => handleChange({request: v})}
                                                height="700px"/>
                                </fieldset>
                            </TabCase>
                            <TabCase id={1}>
                                <fieldset style={{marginTop: 20}}>
                                    <legend>Response</legend>
                                    <JsonEditor value={data?.response} onChange={v => handleChange({response: v})}
                                                height="700px"/>
                                </fieldset>
                            </TabCase>

                        </Tabs>
                    </TuiFormGroupContent>
                </TuiFormGroup>

            </TuiForm>
        </Grid>
    </Grid>
}