import React, {useState} from "react";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import Button from "./Button";
import {useRequest} from "../../../remote_api/requestClient";
import MetaDataFrom from "./MetadataForm";
import {v4 as uuid4} from 'uuid';
import {addConfiguration, getConfiguration} from "../../../remote_api/endpoints/configuration";
import {useFetch} from "../../../remote_api/remoteState";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import {submit} from "../../../remote_api/submit";
import JsonEditor from "../editors/JsonEditor";
import {parse} from "../../../misc/json";
import {TuiSelectConfigurationTypeMemo} from "../tui/TuiSelectConfigurationType";
import ErrorLine from "../../errors/ErrorLine";
import ErrorBox from "../../errors/ErrorBox";

export default function ConfigurationForm({configId, onSubmit}) {

    const [configuration, setConfiguration] = useState({
        name: "",
        description: "",
        enabled: true,
        tags: [],
        config: "{}"
    })
    const [errors, setErrors] = useState({})

    const {request} = useRequest()
    const {isLoading, data, error} = useFetch(
        ["configuration", [configId]],
        getConfiguration(configId),
        data => {
            data.config = JSON.stringify(data.config, null, " ")
            setConfiguration(data)
        },
        {
            enabled: !!configId,
            refetchOnWindowFocus: false
        }
    )

    const handleChange = (v) => {
        setConfiguration({...configuration, ...v})
    }

    const handleSubmit = async () => {

        const config = parse(configuration.config)
        if(config===null) {
            setErrors({
                "body.config": "Invalid JSON"
            })
        } else {
            const payload = {
                id: configuration?.id || uuid4(),
                name: configuration?.name || "",
                description: configuration.description || "",
                enabled: configuration.enabled,
                tags: configuration?.tags || [],
                config: config || {},
                type: {
                    id: "",
                    name: ""
                }
            }

            const response = await submit(request, addConfiguration(payload))
            if(response?.status === 422) {
                setErrors(response.errors)
            } else {
                setErrors({})
                if(onSubmit instanceof Function) onSubmit()
            }
        }
    }

    const handleTypeChange = (configuration) => {
        const newConfigurationType = {
            ...configuration,
            config:JSON.stringify(configuration.config, null, '  ')
        }
        setConfiguration(newConfigurationType)
    }

    if(isLoading) {
        return <CenteredCircularProgress/>
    }
    console.log(1, errors?.body)
    return <>
        <MetaDataFrom name="configuration" value={configuration} onChange={handleChange} errors={errors}/>
    <TuiForm style={{margin: 20}}>
        <TuiFormGroup>
            <TuiFormGroupHeader
                header="Configuration"
            />
            <TuiFormGroupContent>
                <TuiFormGroupField header="Select Configuration Type">
                    <TuiSelectConfigurationTypeMemo initValue={configuration} onSetValue={handleTypeChange}/>
                </TuiFormGroupField>
            </TuiFormGroupContent>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Configuration JSON">
                    <fieldset style={{marginTop: 10}}>
                        <legend>Properties</legend>
                        <JsonEditor value={configuration?.config}
                                    onChange={v => handleChange({config: v})}
                                    height="350px"/>
                        {errors['body.config'] ? <ErrorBox>Invalid JSON</ErrorBox> : "" }
                    </fieldset>

                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
        <Button label="Save" onClick={handleSubmit}/>
    </TuiForm></>
}