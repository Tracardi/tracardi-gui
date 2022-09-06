import React, {useEffect, useRef, useState} from "react";
import {
    TuiForm,
    TuiFormGroup,
    TuiFormGroupContent,
    TuiFormGroupField,
    TuiFormGroupHeader
} from "../elements/tui/TuiForm";
import TuiSelectResource from "../elements/tui/TuiSelectResource";
import {asyncRemote} from "../../remote_api/entrypoint";
import AutoComplete from "../elements/forms/AutoComplete";
import Properties from "../elements/details/DetailProperties";
import {ReactComponent as Connected} from "../../svg/connected.svg";
import HorizontalCircularProgress from "../elements/progress/HorizontalCircularProgress";

function ConnectionStatus({microservice}) {

    return <>
        <div style={{display: "flex", justifyContent: "center"}}>
            <Connected/>
        </div>
        <TuiFormGroupField header="Connection details">
            <Properties properties={{
                microservice: {
                    production: {
                        url: microservice?.server.credentials?.production.url
                    },
                    test: {
                        url: microservice?.server.credentials?.test.url
                    }
                },
                name: microservice?.service?.name
            }
            }/>
        </TuiFormGroupField>
    </>
}

export default function NodeMicroserviceInfo({nodeId, microservice, onServiceSelect, onActionSelect, onActionClear}) {

    const [actionsEndpoint, setActionsEndpoint] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [data, setData] = useState(microservice)
    const [serviceId, setServiceId] = useState("")

    const mounted = useRef(true);

    const fetchResource = (resourceId, onResponse) => {
        setError(null)
        setLoading(true)
        asyncRemote({
            url: `/resource/${resourceId}`
        }).then((response) => {

            // Get current API for fetching action plugins from test credentials

            const creds = response?.data?.credentials?.production
            const microserviceUrl = creds?.url
            const selectedServiceId = microservice?.service.id

            setServiceId(selectedServiceId)
            setActionsEndpoint({
                endpoint: {
                    baseURL: microserviceUrl,
                    url: `/actions?service_id=${selectedServiceId}`
                },
                token: creds?.token
            })

            if (onResponse instanceof Function) {
                onResponse(response)
            }
        }).catch((e) => {
            if (mounted.current) {
                setError(e.toString())
            }
        }).finally(() => {
            if (mounted.current) {
                setLoading(false)
            }
        })
    }

    useEffect(() => {
        setData(microservice)
        if (microservice?.server?.resource?.id) {
            fetchResource(microservice.server.resource.id)
        }
    }, [nodeId, microservice.server.resource.id])


    if(loading) {
        return <div style={{height: 60, display: "flex", justifyContent: "center"}}><HorizontalCircularProgress size={20} label="Loading microservice configuration"/></div>
    }

    const hasServerSetUp = () => {
        return microservice?.server?.resource?.id && microservice.server.resource?.id !== ""
    }

    const handleResourceSelect = async (resource) => {

        setData({
            ...data,
            resource: resource
        })

        fetchResource(resource.id, (response) => {
            if (onServiceSelect instanceof Function) {
                onServiceSelect({
                    ...resource,  // it is {id, name}
                    resource: response.data?.credentials?.test
                })
            }
        })
    }

    const handleActionSelect = async (value) => {

        const state = {
            ...data,
            plugin: {
                ...value,
                resource: (data?.plugin?.resource) ? data.plugin.resource : null,
            }
        }

        setData(state)

        if (value?.id === "") {
            if (onActionClear instanceof Function) {
                onActionClear(state)
            }
        } else {
            if (onActionSelect instanceof Function) {
                onActionSelect({
                    endpoint: actionsEndpoint.endpoint,
                    token: actionsEndpoint.token,
                    serviceId: serviceId,
                    actionId: value.id,
                    plugin: state.plugin
                })
            }
        }
    };

    return <TuiForm>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Microservice configuration"/>
            <TuiFormGroupContent>
                {!hasServerSetUp() &&
                <TuiFormGroupField header="Server" description="Select microservice server resource.">
                    <TuiSelectResource
                        placeholder="Microservice"
                        tag="microservice"
                        value={data?.server?.resource}
                        onSetValue={handleResourceSelect}
                    />
                </TuiFormGroupField>}
                {hasServerSetUp() && <ConnectionStatus microservice={data}/>}
                <TuiFormGroupField header="Action" description="Select action this microservice must perform.">
                    {actionsEndpoint && <AutoComplete
                        error={error}
                        endpoint={actionsEndpoint?.endpoint}
                        token={actionsEndpoint?.token}
                        onlyValueWithOptions={false}
                        value={data?.plugin}
                        onSetValue={handleActionSelect}
                    />}
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
    </TuiForm>
}