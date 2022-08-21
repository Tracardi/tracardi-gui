import React, {useEffect, useRef, useState} from "react";
import {
    TuiForm,
    TuiFormGroup,
    TuiFormGroupContent,
    TuiFormGroupField,
    TuiFormGroupHeader
} from "../elements/tui/TuiForm";
import TuiSelectResource from "../elements/tui/TuiSelectResource";
import AutoComplete from "../elements/forms/AutoComplete";
import Button from "../elements/forms/Button";
import {asyncRemote} from "../../remote_api/entrypoint";

const LoadableAutoComplete = ({value, placeholder, errorMessage, onSelect, endpoint, disabled = true}) => {
    return <AutoComplete
        disabled={disabled}
        endpoint={endpoint}
        onlyValueWithOptions={true}
        placeholder={placeholder}
        initValue={value}
        error={errorMessage}
        onSetValue={onSelect}
    />
}

export default function RemoteNodeForm({microservice, onConnect}) {

    const [servicesUrl, setServicesUrl] = useState(null)
    const [actionsUrl, setActionsUrl] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [data, setData] = useState(microservice)

    const mounted = useRef(true);

    useEffect(() => {
        mounted.current = true;

        return () => {
            mounted.current = false;
        };
    }, []);

    console.log("microservice", microservice)
    console.log("data", data)

    const disabled = false

    const handleResourceSelect = (resource) => {
        setServicesUrl({url: "http://localhost:8686/services"})
        setActionsUrl({url: "http://localhost:8686/actions"})
        setData({
            ...data,
            resource: resource
        })
    }

    const handlePluginFetch = async () => {
        try {
            setError(null)
            setLoading(true)
            const resposne = await asyncRemote({
                url: "http://localhost:8686/plugin"
            })
            if (onConnect instanceof Function) {
                const result = {
                    microservice: data,
                    plugin: resposne.data
                }
                onConnect(result)
            }
        } catch (e) {
            if(mounted.current) {
                setError(e.toString())
            }
        } finally {
            if(mounted.current) {
                setLoading(false)
            }
        }
    }

    const handleServiceSelect = (value) => {
        setData({
            ...data,
            service: value
        })
    };

    const handleActionSelect = (value) => {
        setData({
            ...data,
            action: value
        })
    };

    return <TuiForm>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Microservice" description="Define microservice location."/>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Server" description="Select microservice server resource.">
                    <TuiSelectResource tag="microservice"
                                       value={data?.resource}
                                       onSetValue={handleResourceSelect}
                    />
                </TuiFormGroupField>
                <TuiFormGroupField header="Service" description="Select microservice type.">
                    <LoadableAutoComplete
                        disabled={disabled}
                        endpoint={servicesUrl}
                        value={data?.service}
                        onSelect={handleServiceSelect}
                    />
                </TuiFormGroupField>
                <TuiFormGroupField header="Action plugin" description="Select action plugin.">
                    <LoadableAutoComplete
                        disabled={disabled}
                        endpoint={actionsUrl}
                        value={data?.action}
                        onSelect={handleActionSelect}
                    />
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
        <Button label="Submit" onClick={() => handlePluginFetch()} progress={loading} error={error !== null}/>
    </TuiForm>
}