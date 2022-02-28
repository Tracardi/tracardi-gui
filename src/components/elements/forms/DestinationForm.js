import React, {useEffect, useRef, useState} from "react";
import Button from "./Button";
import TextField from "@mui/material/TextField";
import {v4 as uuid4} from 'uuid';
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import TuiTagger from "../tui/TuiTagger";
import ErrorsBox from "../../errors/ErrorsBox";
import JsonEditor from "../editors/JsonEditor";
import DestinationInput from "./inputs/DestinationInput";
import {asyncRemote, getError} from "../../../remote_api/entrypoint";
import Switch from "@mui/material/Switch";
import TuiTopHeaderWrapper from "../tui/TuiTopHeaderWrapper";
import TuiColumnsFlex from "../tui/TuiColumnsFlex";

export default function DestinationForm({onSubmit, value: initValue}) {

    console.log(initValue)

    if(initValue) {
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
            resource: null
        }
    }
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(initValue);

    const mounted = useRef(false);

    useEffect(() => {
        mounted.current = true;

        return () => {
            mounted.current = false;
        };
    }, []);

    const handleSubmit = async () => {
        setProcessing(true);
        try {
            const response = await asyncRemote({
                url: "destination",
                method: "POST",
                data: {
                    id: data.id,
                    name:data?.name,
                    description:data?.description,
                    enabled: data?.enabled,
                    tags: data?.tags,
                    destination: {
                        package: data?.destination?.package,
                        init: JSON.parse(data?.destination?.init),
                        form: data?.destination?.form
                    },
                    mapping: JSON.parse(data.mapping),
                    resource: data.resource
                }
            })

            setError(null)

            if(onSubmit && mounted.current === true) {
                onSubmit(response.data)
            }

        } catch (e) {
            if(e && mounted.current === true) {
                setError(getError(e))
            }
        } finally {
            if(mounted.current === true) {setProcessing(false);}
        }

    }

    const handleDestinationChange = (value, params) => {
        const d = {...data,
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
            <TuiFormGroupHeader header="Destination"/>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Destination" description="Select destination system.">
                    <TuiColumnsFlex width={300}>
                        <TuiTopHeaderWrapper header="Destination"
                                             description="Select destination system.">
                            <DestinationInput
                                value={data?.resource?.id || ""}
                                onChange={handleDestinationChange}/>
                        </TuiTopHeaderWrapper>
                        <TuiTopHeaderWrapper header="Is active"
                                             description="Profile will NOT be sent to deactivated destination.">
                            <div style={{display: "flex", alignItems: "center"}}>
                                <Switch
                                    checked={data?.enabled}
                                    onChange={(ev) => setData({...data, enabled: ev.target.checked})}
                                />
                                <span>
                        This destination is {data?.enabled===true ? "enabled" : "disabled"}
                    </span>
                            </div>
                        </TuiTopHeaderWrapper>
                    </TuiColumnsFlex>



                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Destination description"/>
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
                <TuiFormGroupField header="Description"
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
                <TuiFormGroupField header="Destination tags"
                                   description="Tag the destination to group it into meaningful groups.">
                    <TuiTagger tags={data?.tags} onChange={(value) => setData({...data, tags: value})}/>
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Data mapping"/>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Mapping" description="Map data from profile to destination schema.">
                    <fieldset>
                        <legend>Data mapping</legend>
                        <JsonEditor value={data?.mapping}
                                    onChange={(value) =>setData({...data, mapping: value})}/>
                    </fieldset>
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>

        <TuiFormGroup>
            <TuiFormGroupHeader header="Destination settings"/>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Configuration">
                    <fieldset>
                        <legend>Settings</legend>
                        <JsonEditor value={data?.destination?.init}
                                    onChange={(value) =>setData({...data, destination: {...data.destination, init: value}})}/>
                    </fieldset>
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
        {error && <ErrorsBox errorList={error} style={{borderRadius: 0}}/>}
        <Button label="Save"
                onClick={handleSubmit}
                style={{justifyContent: "center"}} p
                rogress={processing}
                error={error !== null}/>
    </TuiForm>
}

