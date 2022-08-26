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

export default function NodeMicroserviceInfo({nodeId, microservice, onServiceSelect, onPluginSelect}) {

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

            const creds = response?.data?.credentials?.test

            const microserviceUrl = creds?.credentials?.url
            const selectedServiceId = microservice?.service.id

            setServiceId(selectedServiceId)
            setActionsEndpoint({
                baseURL: microserviceUrl,
                url: `/actions?service_id=${selectedServiceId}`
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

    // tego uzywam aby zresetowac stan gdy mamy dwa takie same nody i klikamy pomiędzy nimi.
    useEffect(() => {
        // Reset to default values if node changes
        setData(microservice)
        if (microservice?.server?.resource?.id) {
            fetchResource(microservice.server.resource.id)
        }
    }, [nodeId, microservice])


    const hasServerSetUp = () => {
        return microservice?.server?.resource?.id && microservice.server.resourceid !== ""
    }

    const hasServiceSetUp = () => {
        return microservice?.service?.id && microservice.service.id !== ""
    }

    const hasResourceSetUp = () => {
        return microservice?.plugin?.resource
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

        try {
            setError(null)
            setLoading(true)
            const response = await asyncRemote({
                baseURL: actionsEndpoint.baseURL,
                url: `/plugin/form?service_id=${serviceId}&action_id=${value.id}`
            })
            if (onPluginSelect instanceof Function) {
                onPluginSelect({
                    plugin: state.plugin,
                    config: response.data
                })
            }
        } catch (e) {
            if (mounted.current) {
                setError(e.toString())
            }
        } finally {
            if (mounted.current) {
                setLoading(false)
            }
        }
    };

    return <TuiForm>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Microservice"/>
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
                {hasServerSetUp() && <TuiFormGroupField header="Microservice server">
                    <Properties properties={data?.server.credentials}/>
                </TuiFormGroupField>}
                {hasServiceSetUp() && <TuiFormGroupField header="Service type details">
                    <Properties properties={data?.service}/>
                </TuiFormGroupField>}
                {hasResourceSetUp() && <TuiFormGroupField header="Service external resource">
                    <Properties properties={data?.plugin.resource}/>
                </TuiFormGroupField>}
                <TuiFormGroupField header="Action plugin" description="Select action plugin.">
                    <AutoComplete
                        endpoint={actionsEndpoint}
                        onlyValueWithOptions={false}
                        value={data?.plugin}
                        onSetValue={handleActionSelect}
                    />
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
    </TuiForm>
}