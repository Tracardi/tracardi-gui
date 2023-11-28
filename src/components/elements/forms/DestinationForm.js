import React, {useEffect, useRef, useState} from "react";
import Button from "./Button";
import TextField from "@mui/material/TextField";
import {v4 as uuid4} from 'uuid';
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import TuiTagger from "../tui/TuiTagger";
import ErrorsBox from "../../errors/ErrorsBox";
import JsonEditor from "../editors/JsonEditor";
import DestinationInput from "./inputs/DestinationInput";
import {getError} from "../../../remote_api/entrypoint";
import Switch from "@mui/material/Switch";
import TuiSelectEventType from "../tui/TuiSelectEventType";
import {TuiSelectEventSource} from "../tui/TuiSelectEventSource";
import {useRequest} from "../../../remote_api/requestClient";
import ShowHide from "../misc/ShowHide";

export default function DestinationForm({onSubmit, value: initValue}) {

    if (initValue) {
        initValue = {
            ...initValue,
            mapping: JSON.stringify(initValue?.mapping, null, " "),
            destination: {
                ...initValue?.destination,
                init: JSON.stringify(initValue?.destination.init, null, " ")
            }
        }
    } else {
        initValue = {
            id: uuid4(),
            name: "",
            description: "",
            enabled: false,
            tags: [],
            destination: {
                package: "",
                init: "{}",
                form: null
            },
            mapping: "{}",
            condition: "",
            resource: null,
            on_profile_change_only: true,
            event_type: {
                id: "",
                name: ""
            },
            source: {
                id: "",
                name: ""
            }
        }
    }
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(initValue);

    const mounted = useRef(false);
    const {request} = useRequest()

    useEffect(() => {
        mounted.current = true;

        return () => {
            mounted.current = false;
        };
    }, []);

    const handleSubmit = async () => {
        setProcessing(true);
        try {
            const response = await request({
                url: "destination",
                method: "POST",
                data: {
                    id: data.id,
                    name: data?.name,
                    description: data?.description,
                    enabled: data?.enabled,
                    tags: data?.tags,
                    destination: {
                        package: data?.destination?.package,
                        init: JSON.parse(data?.destination?.init),
                        form: data?.destination?.form
                    },
                    mapping: JSON.parse(data.mapping),
                    condition: data?.condition,
                    resource: data?.resource,
                    source: data?.source,
                    event_type: data?.event_type,
                    on_profile_change_only: data?.on_profile_change_only
                }
            })

            setError(null)

            if (onSubmit && mounted.current === true) {
                onSubmit(response.data)
            }

        } catch (e) {
            if (e && mounted.current === true) {
                setError(getError(e))
            }
        } finally {
            if (mounted.current === true) {
                setProcessing(false);
            }
        }

    }

    const handleDestinationChange = (value, params) => {
        const d = {
            ...data,
            destination: {
                package: params?.destination?.package,
                init: JSON.stringify(params?.destination?.init, null, " "),
                form: params?.destination?.form
            },
            resource: {id: params?.id}
        }
        setData(d)
    }

    return <TuiForm style={{margin: 20}}>

        <TuiFormGroup>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Name" description="Destination name can be any string that
                    identifies destination.">
                    <TextField
                        label={"Destination name"}
                        value={data?.name}
                        onChange={(ev) => {
                            setData({...data, name: ev.target.value})
                        }}
                        size="small"
                        variant="outlined"
                        fullWidth
                    />
                </TuiFormGroupField>
                <TuiFormGroupField header={<span>Description <sup>(Optional)</sup></span>}
                                   description="Description will help you to understand when where the profile data we be send.">
                    <TextField
                        label={"Destination description"}
                        value={data?.description}
                        multiline
                        rows={3}
                        onChange={(ev) => {
                            setData({...data, description: ev.target.value})
                        }}
                        variant="outlined"
                        fullWidth
                    />
                </TuiFormGroupField>
                <ShowHide label="Tags Configuration" style={{marginTop: 20}}>
                    <TuiFormGroupField header="Destination tags"
                                       description="Tag the destination to group it into meaningful groups.">
                        <TuiTagger tags={data?.tags} onChange={(value) => setData({...data, tags: value})}/>
                    </TuiFormGroupField>
                </ShowHide>

            </TuiFormGroupContent>
        </TuiFormGroup>

        <TuiFormGroup>
            <TuiFormGroupHeader header="Destination" description="Destinations is a list of services where Tracardi will
            send profile data. Destinations will be triggered only when the profile changes. Depending on the
            configuration the whole process may be postponed and triggered when the stream of events associated with
            a set of profile changes ends."/>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Destination">
                    <DestinationInput
                        fullWidth={true}
                        value={data?.resource?.id || ""}
                        onChange={handleDestinationChange}/>
                </TuiFormGroupField>
                <TuiFormGroupField header="Activate" description="Data will NOT be sent to deactivated destination.">
                    <div style={{display: "flex", alignItems: "center"}}>
                        <Switch
                            checked={data?.enabled}
                            onChange={(ev) => setData({...data, enabled: ev.target.checked})}
                        />
                        <span>This destination is {data?.enabled === true ? "enabled" : "disabled"}</span>
                    </div>
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>


        <TuiFormGroup>
            <TuiFormGroupHeader header="Destination Trigger"/>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Send only on profile change"
                                   description="This destination will be triggered only if profile changes.">
                    <div style={{display: "flex", alignItems: "center"}}>
                        <Switch
                            checked={data?.on_profile_change_only}
                            onChange={(ev) => setData({...data, on_profile_change_only: ev.target.checked})}
                        />
                        <span>This destination is triggered on {data?.on_profile_change_only === true ? "profile change only" : "on every event"}</span>
                    </div>
                </TuiFormGroupField>
                {!data?.on_profile_change_only && <>
                    <TuiFormGroupField header="Send only when event comes from event source"
                                       description="This destination will be triggered only for selected event source.">
                        <TuiSelectEventSource
                            label="Event source"
                            value={data?.source}
                            onSetValue={(source) => setData({...data, source})}
                        />
                    </TuiFormGroupField>
                    <TuiFormGroupField header="Send only selected event type"
                                       description="This destination will be triggered only for selected event type.">
                        <TuiSelectEventType
                            label="Event type"
                            onlyValueWithOptions={false}
                            initValue={data?.event_type}
                            onSetValue={(event) => setData({...data, event_type: event})}
                        />
                    </TuiFormGroupField>
                </>
                }
                <ShowHide label="Pre-Conditions" style={{marginTop: 20}}>
                <TuiFormGroupField header={<span>Data pre-condition <sup>(Optional)</sup></span>} description="Type a condition that has to be met
                before the data is sent to the destination. E.g. Some destinations may require not empty e-mail field.
                Leave the prerequisites blank if the destination does not have any pre-condition to be checked.">
                    <TextField
                        label="Pre-condition"
                        value={data?.condition}
                        onChange={(e) => setData({...data, condition: e.target.value})}
                        multiline
                        rows={3}
                        variant="outlined"
                        fullWidth
                    />
                </TuiFormGroupField>
                </ShowHide>
            </TuiFormGroupContent>
        </TuiFormGroup>

        <TuiFormGroup>
            <TuiFormGroupHeader header="Data mapping"/>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Mapping" description="Map data from profile to destination schema.
                Use profile reference e.g profile@... to access profile data.">
                    <fieldset>
                        <legend>Data mapping</legend>
                        <JsonEditor value={data?.mapping}
                                    onChange={(value) => setData({...data, mapping: value})}/>
                    </fieldset>
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
        <ShowHide label="Advanced Configuration" style={{marginTop: 20, marginBottom: 20}}>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Destination settings"/>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Configuration">
                    <fieldset>
                        <legend>Settings</legend>
                        <JsonEditor value={data?.destination?.init}
                                    onChange={(value) => setData({
                                        ...data,
                                        destination: {...data.destination, init: value}
                                    })}/>
                    </fieldset>
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
        </ShowHide>
        {error && <ErrorsBox errorList={error} style={{borderRadius: 0}}/>}
        <Button label="Save"
                onClick={handleSubmit}
                style={{justifyContent: "center"}} p
                rogress={processing}
                error={error !== null}/>
    </TuiForm>
}

