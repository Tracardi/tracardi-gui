import React, {useState} from "react";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import Button from "./Button";
import {useRequest} from "../../../remote_api/requestClient";
import MetaDataFrom from "./MetadataForm";
import {v4 as uuid4} from 'uuid';
import {addSubscription, getSubscription} from "../../../remote_api/endpoints/subscription";
import {useFetch} from "../../../remote_api/remoteState";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import {submit} from "../../../remote_api/submit";
import DisabledInput from "./inputs/DisabledInput";

export default function SubscriptionForm({subscriptionId, onComplete}) {

    const [subscription, setSubscription] = useState({
        token: uuid4(),
        topic: uuid4()
    })
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
            />
            <TuiFormGroupContent>
                <TuiFormGroupField header="Topic ID"
                                   description="Topic id is auto-generated. In most cases you do not have to change it,
                                   just leave it like it is. In rare cases when you would like to create a topic
                                   with user defined value, then unlock the field and change the id. Topic is used
                                   to send messages to subscribers.">
                    <DisabledInput label={"Topic id"}
                                   value={subscription?.topic || uuid4()}
                                   onChange={(v) => handleChange({topic: v})}/>
                </TuiFormGroupField>
                <TuiFormGroupField header="Token"
                                   description="Topic id is auto-generated. It is required to authenticate triggering the subscription list.">
                    <DisabledInput label={"Token"}
                                   value={subscription?.token || uuid4()} />
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
        <Button label="Save" onClick={handleSubmit}/>
    </TuiForm></>
}