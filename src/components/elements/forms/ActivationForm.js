import React, {useRef, useState} from "react";
import {useRequest} from "../../../remote_api/requestClient";
import MetaDataFrom from "./MetadataForm";
import {v4 as uuid4} from 'uuid';
import {useFetch} from "../../../remote_api/remoteState";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import {submit} from "../../../remote_api/submit";
import {useObjectState} from "../../../misc/useSyncState";
import FetchError from "../../errors/FetchError";
import {addActivation, getActivation} from "../../../remote_api/endpoints/activation";
import Button from "./Button";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupHeader} from "../tui/TuiForm";
import {TuiSelectActivationType} from "../tui/TuiSelectActivationType";
import JsonForm from "./JsonForm";
import AudienceFetcherQuery from "./inputs/AudienceFetcherQuery";

function ActivationForm({value, onSubmit, errors}) {
    const {update, get, set, submit} = useObjectState(
        {
            name: "ActivationForm",
            value,
            defaultValue: {
                name: "",
                description: "",
                audience_query: "",
                activation_type: {id: "", name: ""},
                tags: [],
                config: {}
            },
            onSubmit
        }
    )

    const {request} = useRequest()
    const config = useRef(value?.config)
    console.log('config.current', config.current)
    const handleConfigChange = (value) => {
        config.current = value
    };

    const handleTypeChange = async (value) => {
        try {
          const response = await request({
              url: `/activation-type/${value.id}`
          }, true)
            let data = {}
            data.activation_type = value

            data.config = {}
            data.configFormSchema = response
            update(data)

            value.config = {}
            config.current = {}

        } catch (e) {
            console.error(e)
        }
    };

    const handleSubmit = () => {
        const data = set("config", config.current)
        submit(data)
    }

    const handleSubmitAndActivate = () => {
        update({config: config.current})
    }

    return <>
        <MetaDataFrom name="activation"
                      value={get()}
                      onChange={update}
                      errors={errors}/>
        <TuiForm style={{margin: 20}}>
            <TuiFormGroup>
                <TuiFormGroupHeader
                    header="Audience selection"
                    description="Please define the audience which you would like to activate. You can join multiple audiences together."
                />
                <TuiFormGroupContent>
                    <AudienceFetcherQuery value={get()}
                                          onChange={update}
                                          error={(errors && errors["body.audience_query"]) || ""}
                    />
                </TuiFormGroupContent>
            </TuiFormGroup>
            <TuiFormGroup>
                <TuiFormGroupHeader
                    header="Activation Type"
                    description="Please select what type of actvation you would like to perform."
                />
                <TuiFormGroupContent>
                    <TuiSelectActivationType
                        initValue={get()?.activation_type}
                        onChange={handleTypeChange}
                        errorMessage={(errors && errors["body.activation_type"]) || ""}/>
                </TuiFormGroupContent>
            </TuiFormGroup>
            {get()?.configFormSchema?.form && <TuiFormGroup>
                <JsonForm schema={get()?.configFormSchema?.form}
                          values={config.current}
                          onChange={handleConfigChange}/>
            </TuiFormGroup>}
            <Button label="Save" onClick={handleSubmit}/>
            <Button label="Save & Activate" onClick={handleSubmitAndActivate}/>
        </TuiForm>

    </>
}

function ActivationFormById({activationId, onSubmit}) {

    const [errors, setErrors] = useState({})
    const {request} = useRequest()
    const {isLoading, data, error} = useFetch(
        ["activationById", [activationId]],
        getActivation(activationId),
        async (data) => {
            try {
                data.configFormSchema = await request({
                    url: `/activation-type/${data?.activation_type?.id}`
                }, true)
            } catch (e) {

            }
            return data
        },
        {
            enabled: !!activationId,
            cache: 0
        }
    )

    if (isLoading) {
        return <CenteredCircularProgress/>
    }

    if (error) {
        return <FetchError error={error}/>
    }

    const handleSubmit = async (data) => {
        try {
            const payload = {
                id: uuid4(),
                ...data
            }
            const response = await submit(request, addActivation(payload))
            if (response.status === 422) {
                setErrors(response.errors)
            } else {
                setErrors({})
                if (onSubmit instanceof Function) onSubmit(data)
            }

        } catch (e) {
            console.error(e)
        }
    }

    return <ActivationForm value={data} onSubmit={handleSubmit} errors={errors}/>
}

export default ActivationFormById