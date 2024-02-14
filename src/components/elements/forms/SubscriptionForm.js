import React, {useState} from "react";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupHeader} from "../tui/TuiForm";
import Button from "./Button";
import {useRequest} from "../../../remote_api/requestClient";
import MetaDataFrom from "./MetadataForm";
import {v4 as uuid4} from 'uuid';
import TextField from "@mui/material/TextField";
import {addSubscription, getSubscription} from "../../../remote_api/endpoints/subscription";
import {useFetch} from "../../../remote_api/remoteState";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import {submit} from "../../../remote_api/submit";

export default function SubscriptionForm({subscriptionId, onComplete}) {

    const [subscription, setSubscription] = useState({})
    const [errors, setErrors] = useState({})

    const {request} = useRequest()
    const {isLoading, data, error} = useFetch(
        ["subscription", [subscriptionId]],
        getSubscription(subscriptionId),
        data => {
            setSubscription(data)
        },
        {
            enabled: !!subscriptionId,
        }
    )

    const handleChange = (v) => {
        setSubscription({...subscription, ...v})
    }

    const handleSubmit = async () => {
        const payload = {
            id: uuid4(),
            ...subscription,
        }
        console.log(payload)
        const response = await submit(request, addSubscription(payload))
        if(response?.status === 422) {
            setErrors(response.errors)
        } else {
            setErrors({})
            if(onComplete instanceof Function) onComplete()
        }
    }

    if(isLoading) {
        return <CenteredCircularProgress/>
    }

    return <><MetaDataFrom name="subscription" value={subscription} onChange={handleChange} errors={errors}/>
    <TuiForm style={{margin: 20}}>
        <TuiFormGroup>
            <TuiFormGroupHeader
                header="Subscription topic"
                description="Please define the topic of the subscription, e.g. new-products."
            />
            <TuiFormGroupContent>
                <TextField
                    label="Topic"
                    value={subscription?.topic || ""}
                    onChange={(ev) => {
                        handleChange({"topic": ev.target.value})
                    }}
                    error={"body.topic" in errors}
                    helperText={errors["body.topic"] || ""}
                    size="small"
                    variant="outlined"
                    fullWidth
                />
            </TuiFormGroupContent>
        </TuiFormGroup>
        <Button label="Save" onClick={handleSubmit}/>
    </TuiForm></>
}