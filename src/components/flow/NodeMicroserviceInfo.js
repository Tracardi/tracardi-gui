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
import useAfterMountEffect from "../../effects/AfterMountEffect";
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

            const microserviceUrl = response.data?.credentials?.test?.url
            const selectedServiceId = response.data?.credentials?.test?.service.id
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
        if(microservice.resource.id) {
            fetchResource(microservice.resource.id)
        }
    }, [nodeId, microservice])


    const hasResourceSetUp = () => {
        return microservice.resource.id !== ""
    }

    const handleResourceSelect = async (resource) => {

        setData({
            ...data,
            resource: resource
        })

        fetchResource(resource.id, (response) => {
            if (onServiceSelect instanceof Function) {
                onServiceSelect({
                    ...resource,
                    current: response.data?.credentials?.test
                })
            }
        })


    }

    const handleActionSelect = async (value) => {

        setData({
            ...data,
            plugin: value
        })

        try {
            setError(null)
            setLoading(true)
            const response = await asyncRemote({
                baseURL: actionsEndpoint.baseURL,
                url: `/plugin/form?service_id=${serviceId}&action_id=${value.id}`
            })
            if (onPluginSelect instanceof Function) {
                onPluginSelect({
                    plugin: value,
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
                { !hasResourceSetUp() && <TuiFormGroupField header="Server" description="Select microservice server resource.">
                    <TuiSelectResource
                        placeholder="Microservice"
                        tag="microservice"
                        value={data?.resource}
                        onSetValue={handleResourceSelect}
                    />
                </TuiFormGroupField>}
                { hasResourceSetUp() && <TuiFormGroupField header="Microservice details">
                    <Properties properties={data?.resource?.current} />
                </TuiFormGroupField>}
                { hasResourceSetUp() && <TuiFormGroupField header="Microservice resource">
                    <Properties properties={data?.resource} exclude={'current'}/>
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