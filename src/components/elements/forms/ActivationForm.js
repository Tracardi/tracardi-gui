import React, {memo, useState} from "react";
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
import TextField from "@mui/material/TextField";
import {TuiSelectActivationTypeMemo} from "../tui/TuiSelectActivationType";

function ActivationForm({value, onSubmit, errors}) {

    const {update, get, submit} = useObjectState(value || {
        name: "",
        description: "",
        audience_query: "",
        activation_type: {id:"", name: ""},
        tags: []
    }, null, onSubmit)

    console.log(get())

    return <>
        <MetaDataFrom name="activation" value={get()} onChange={update} errors={errors}/>
        <TuiForm style={{margin: 20}}>
            <TuiFormGroup>
                <TuiFormGroupHeader
                    header="Audience selection"
                    description="Please define the audience which you would like to activate. You can join multiple audiences together."
                />
                <TuiFormGroupContent>
                    <TextField
                    value={get()?.audience_query || ""}
                    label="Audience selection"
                    size="small"
                    error={errors && "body.audience_query" in errors}
                    helperText={(errors && errors["body.audience_query"]) || ""}
                    fullWidth
                    onChange={ev => update({audience_query: ev.target.value})}
                />
                </TuiFormGroupContent>
            </TuiFormGroup>
            <TuiFormGroup>
                <TuiFormGroupHeader
                    header="Activation Type"
                    description="Please select what type of actvation you would like to perform."
                />
                <TuiFormGroupContent>
                    <TuiSelectActivationTypeMemo
                        initValue={get()?.activation_type}
                        onChange={v => update({activation_type: v})}
                        errorMessage={(errors && errors["body.activation_type"]) || ""}/>
                </TuiFormGroupContent>
            </TuiFormGroup>
            <Button label="Save" onClick={submit}/>
            <Button label="Save & Activate" onClick={submit}/>
        </TuiForm>

    </>
}

function ActivationFormById({activationId, onSubmit}) {

    const [errors, setErrors] = useState({})
    const {request} = useRequest()
    const {isLoading, data, error} = useFetch(
        ["activationById", [activationId]],
        getActivation(activationId),
        data => {
            return data
        },
        {
            enabled: !!activationId,
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

export default memo(ActivationFormById)