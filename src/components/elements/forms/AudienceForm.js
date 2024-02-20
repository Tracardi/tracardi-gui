import React, {memo, useState} from "react";
import ListOfForms from "./ListOfForms";
import AudienceFilteringForm from "./AudienceFilteringForm";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupHeader} from "../tui/TuiForm";
import KqlAutoComplete from "./KqlAutoComplete";
import {external} from "../misc/linking";
import Button from "./Button";
import {useRequest} from "../../../remote_api/requestClient";
import {addAudience, getAudience} from "../../../remote_api/endpoints/audience";
import MetaDataFrom from "./MetadataForm";
import {v4 as uuid4} from 'uuid';
import {useFetch} from "../../../remote_api/remoteState";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import {submit} from "../../../remote_api/submit";
import {useObjectState} from "../../../misc/useSyncState";
import AudienceDetails from "../details/AudienceDetails";
import DrawerButton from "./buttons/DrawerButton";
import FetchError from "../../errors/FetchError";

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
                        align="bottom"/>
})

function AudienceForm({value, errors, onSubmit}) {

    const {set, get} = useObjectState(value || {
        name: "",
        description: "",
        join: []
    })
    const [audience, setAudience] = useState(null)

    const handleSubmit = () => {
        if(onSubmit instanceof Function) {
            onSubmit(get())
        }
    }

    const handleEstimate = () => {
        const _audience = {...get(), id: uuid4()}
        console.log(1, _audience)
        setAudience(_audience)
        return true
    }

    return <>
        <MetaDataFrom name="audience" value={get()} onChange={set} errors={errors}/>
        <TuiForm style={{margin: 20}}>
            <TuiFormGroup>
                <TuiFormGroupHeader
                    header="Audience selection"
                    description="Please define how to filter out the audience from your database."
                />
                <TuiFormGroupContent>
                    <KqlAutoComplete
                        index="profile"
                        label="Filter by profile attributes"
                        value={get()?.filter || ""}
                    />
                    <div style={{fontSize: 12}}>Do not know how to filter. Click <span
                        style={{textDecoration: "underline", cursor: "pointer"}}
                        onClick={external("http://docs.tracardi.com/running/filtering/", true)}>here</span> for information.
                    </div>
                </TuiFormGroupContent>
                <TuiFormGroupContent description="Add required events" style={{paddingTop:0}}>
                    <fieldset>
                        <legend>Profiles must have</legend>
                        <ListOfAggregations
                            value={get()?.join || []}
                            onChange={(v) => set({join: v})}
                        />
                    </fieldset>
                </TuiFormGroupContent>
            </TuiFormGroup>
            <Button label="Save" onClick={handleSubmit}/>
            <DrawerButton label="Estimate" onClick={handleEstimate}>
                <AudienceDetails audience={audience}/>
            </DrawerButton>
        </TuiForm>
        </>
}

function AudienceFormById({audienceId, onSubmit}) {

    const [errors, setErrors] = useState({})

    const {request} = useRequest()
    const {isLoading, data, error} = useFetch(
        ["audienceById", [audienceId]],
        getAudience(audienceId),
        data => {
            return data
        },
        {
            enabled: !!audienceId,
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
            const response = await submit(request, addAudience(payload))
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
    return <AudienceForm value={data} onSubmit={handleSubmit} errors={errors}/>
}

export default memo(AudienceFormById)