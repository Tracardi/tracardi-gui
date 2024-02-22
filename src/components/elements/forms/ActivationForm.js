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

function ActivationForm({value, errors, onSubmit}) {

    const {set, get} = useObjectState(value || {
        name: "",
        description: ""
    })

    const [audience, setAudience] = useState(null)

    const handleSubmit = () => {
        if(onSubmit instanceof Function) {
            onSubmit(get())
        }
    }

    return <>
        <MetaDataFrom name="audience" value={get()} onChange={set} errors={errors}/>

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

    if(isLoading) {
        return <CenteredCircularProgress/>
    }

    if(error) {
        return <FetchError error={error}/>
    }

    const handleSubmit = async (data) => {
        try {
            const payload = {
                id: uuid4(),
                ...data
            }
            const response = await submit(request, addActivation(payload))
            if(response.status === 422) {
                setErrors(response.errors)
            } else {
                setErrors({})
                if(onSubmit instanceof Function) onSubmit()
            }

        } catch (e) {
            console.error(e)
        }
    }
    return <ActivationForm value={data} onSubmit={handleSubmit} errors={errors}/>
}

export default memo(ActivationForm)