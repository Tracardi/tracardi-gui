import React, {memo, useState} from "react";
import ListOfForms from "./ListOfForms";
import AudienceFilteringForm from "./AudienceFilteringForm";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupHeader} from "../tui/TuiForm";
import KqlAutoComplete from "./KqlAutoComplete";
import {external} from "../misc/linking";
import Button from "./Button";
import {useRequest} from "../../../remote_api/requestClient";
import {addAudience} from "../../../remote_api/endpoints/audience";
import MetaDataFrom from "./MetadataForm";
import {v4 as uuid4} from 'uuid';
import {useFetch} from "../../../remote_api/remoteState";
import {getSubscription} from "../../../remote_api/endpoints/subscription";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import {submit} from "../../../remote_api/submit";

const ListOfAggregations = memo(function ({value, onChange}) {
    return <ListOfForms form={AudienceFilteringForm}
                        value={value}
                        defaultFormValue={{
                            entity: {
                                type: "event",
                                event_type: {id: "", name: ""},
                                where: ""
                            },
                            group_by: [],
                            group_where: ""
                        }}
                        onChange={onChange}
                        initEmpty={true}
                        align="bottom"/>
})

export default function AudienceForm({audienceId, onComplete}) {

    const [errors, setErrors] = useState({})
    const [audience, setAudience] = useState({
        name: "",
        description: "",
        enabled: true,
        tags: [],
        filter: "",
        join: []
    })

    const {request} = useRequest()
    const {isLoading, data, error} = useFetch(
        ["audience", [audienceId]],
        getSubscription(audienceId),
        data => {
            setAudience(data)
        },
        {
            enabled: !!audienceId,
        }
    )

    const handleChange = (v) => {
        setAudience({...audience, ...v})
    }

    const handleSubmit = async () => {
        try {
            const payload = {
                id: uuid4(),
                ...audience
            }
            const response = await submit(request, addAudience(payload))
            if(response.status === 422) {
                setErrors(response.errors)
            } else {
                setErrors({})
                if(onComplete instanceof Function) onComplete()
            }

        } catch (e) {
            console.error(e)
        }
    }

    if(isLoading) {
        return <CenteredCircularProgress/>
    }

    return <><MetaDataFrom name="audience" value={audience} onChange={handleChange} errors={errors}/>
    <TuiForm style={{margin: 20}}>
        <TuiFormGroup>
            <TuiFormGroupHeader
                header="Audience selection"
                description="Please define how to filter out the audience from your database."
            />
            <TuiFormGroupContent>
                <KqlAutoComplete index="profile" label="Filter by profile attributes" value={audience?.filter || ""}/>
                <div style={{fontSize: 12}}>Do not know how to filter. Click <span
                    style={{textDecoration: "underline", cursor: "pointer"}}
                    onClick={external("http://docs.tracardi.com/running/filtering/", true)}>here</span> for information.
                </div>
            </TuiFormGroupContent>
            <TuiFormGroupContent description="Add required events" style={{paddingTop:0}}>
                <fieldset>
                    <legend>Profiles must have</legend>
                    <ListOfAggregations
                        value={audience?.join || []}
                        onChange={(v) => handleChange({join: v})}/>
                </fieldset>
            </TuiFormGroupContent>
        </TuiFormGroup>
        <Button label="Save" onClick={handleSubmit}/>
    </TuiForm></>
}