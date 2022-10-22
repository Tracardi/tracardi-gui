import JsonForm from "../../../elements/forms/JsonForm";
import React, {useRef, useState} from "react";
import {asyncRemote, getError} from "../../../../remote_api/entrypoint";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../../../elements/tui/TuiForm";
import TextField from "@mui/material/TextField";
import TuiTags from "../../../elements/tui/TuiTags";
import {isEmptyObject} from "../../../../misc/typeChecking";
import MicroserviceForm from "../../../elements/forms/MicroserviceForm";
import Button from "../../../elements/forms/Button";

function MicroserviceAndResourceForm({onSubmit}) {

    const [loading, setLoading] = useState(false)
    const [serviceSelected, setServiceSelected] = useState(false)
    const [service, setService] = useState(null)
    const [resourceConfig, setResourceConfig] = useState(null)
    const [error, setError] = useState(null)
    const [formErrors, setFormErrors] = useState(null)

    const handleSubmit = async (resource) => {
        setLoading(true)
        setError(null)
        setFormErrors(null)
        try {
            await asyncRemote({
                baseURL:service?.credentials?.url,
                url: '/service/resource/validate?service_id='+service?.service?.id,
                method: "POST",
                data: resource
            }, service?.credentials?.token)

            if (onSubmit instanceof Function) {
                onSubmit(service, resource)
            }

        } catch (e) {
            if (e?.response?.status === 422) {
                setError(null)
                setFormErrors(e.response.data)
            } else {
                setError(getError(e))
                setFormErrors(null)
            }
        } finally {
            setLoading(false)
        }
    }

    return <>
        <TuiForm>
            <TuiFormGroup>
                <TuiFormGroupHeader header="Microservice Server Configuration"/>
                <TuiFormGroupContent>
                    <MicroserviceForm
                        onServiceChange={(serviceData, serviceResource) => {
                            setResourceConfig(serviceResource)
                            setService(serviceData)
                            setServiceSelected(true)
                        }}
                        onServiceClear={(serviceData) => {
                            setService(serviceData)
                            setResourceConfig(null)
                            setServiceSelected(false)
                        }}
                    />
                </TuiFormGroupContent>
            </TuiFormGroup>
        </TuiForm>
        {resourceConfig && serviceSelected && <JsonForm
            spec={resourceConfig}
            values={resourceConfig.init}
            schema={resourceConfig.form}
            // onChange={handleResourceChange}
            onSubmit={handleSubmit}
            processing={loading}
            errorMessages={formErrors}
            serverSideError={error}
        />}
        {!resourceConfig && serviceSelected && <Button label="Save" onClick={async ()=>await handleSubmit({})}/>}
    </>
}

function DescriptionForm({data: initData, onChange, errorMessage = null}) {

    const [data, setData] = useState(initData || {
        name: "",
        description: "",
        tags: []
    });

    const handleChange = (key, value) => {
        const newValue = {[key]: value}
        const newData = {...data, ...newValue}
        setData(newData)
        if (onChange) {
            onChange(newData)
        }
    }

    return <TuiForm>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Service description"/>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Service name" description="Type service name.">
                    <TextField
                        fullWidth
                        label="Name"
                        size="small"
                        value={data?.name}
                        onChange={(ev) => handleChange("name", ev.target.value)}
                        variant="outlined"
                        error={errorMessage !== null}
                    />
                </TuiFormGroupField>
                <TuiFormGroupField header="Service description" description="Type service name.">
                    <TextField
                        fullWidth
                        multiline
                        rows={5}
                        label="Description"
                        size="small"
                        value={data?.description}
                        onChange={(ev) => handleChange("description", ev.target.value)}
                        variant="outlined"
                    />
                </TuiFormGroupField>

                <TuiFormGroupField header="System tags"
                                   description="Tags are auto generated and are used for resource filtering.">
                    <TuiTags tags={data?.tags} style={{marginLeft: 5, marginTop: 10}}/>
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
    </TuiForm>
}

export default function TracardiProServiceConfigForm({service, onSubmit}) {

    const data = useRef({
        name: "",
        description: "",
        tags: service?.metadata?.tags
    });
    const init = useRef(service?.init);

    const [errorMessages, setErrorMessages] = useState(null)

    const handleChange = (values) => {
        init.current = values
    }

    const getServiceObject = (value) => {
        return {
            metadata: service.metadata,
            form: {
                metadata: data.current,
                data: value
            }
        }
    }

    const getDestinationObject = () => {
        return (service?.destination && !isEmptyObject(service?.destination))
            ? service.destination
            : null
    }

    const getPluginObjects = () => {
        return (service?.plugins && Array.isArray(service?.plugins))
            ? service.plugins
            : null
    }

    const handleSubmitOfMicroservice = async (microservice, resource) => {
        try {

            const response = await asyncRemote({
                url: '/tpro/install/microservice',
                method: "POST",
                data: {
                    service: getServiceObject(microservice.credentials),
                    destination: getDestinationObject(),
                    plugins: getPluginObjects(),
                    microservice: {
                        service: microservice.service,
                        credentials: resource
                    }
                }
            })

            if (onSubmit instanceof Function) {
                onSubmit(response.data);
            }

        } catch (e) {
            if (e?.response?.status === 422) {
                setErrorMessages(e.response.data)
            }
            // todo global error - when url not available
            // setError(getError(e))
        }
    }

    const handleSubmitOfLocalResource = async (value) => {
        try {
            const response = await asyncRemote({
                url: '/tpro/install',
                method: "POST",
                data: {
                    service: getServiceObject(value),
                    destination: getDestinationObject(),
                    plugins: getPluginObjects(),
                }
            })

            if (onSubmit instanceof Function) {
                onSubmit(response.data);
            }

        } catch (e) {
            if (e?.response?.status === 422) {
                setErrorMessages(e.response.data)
            }
            // todo global error - when url not available
            // setError(getError(e))
        }
    }

    const isMicroservice = (service) => {
        return Array.isArray(service?.metadata?.submit) && service?.metadata?.submit?.includes('microservice')
    }

    const isResource = (service) => {
        return Array.isArray(service?.metadata?.submit) && service?.metadata?.submit?.includes('resource')
    }

    return <div>
        <DescriptionForm
            data={data.current}
            onChange={(value) => data.current = value}
            errorMessage={errorMessages}
        />
        {isMicroservice(service) && <MicroserviceAndResourceForm
            onSubmit={handleSubmitOfMicroservice}
        />}
        {isResource(service) && <JsonForm
            spec={service}
            schema={service?.form}
            values={service?.init}
            errorMessages={errorMessages}
            onChange={handleChange}
            onSubmit={handleSubmitOfLocalResource}/>
        }
    </div>
}