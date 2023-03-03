import React, {useEffect, useRef} from "react";
import Button from "../forms/Button";
import Rows from "../misc/Rows";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import {useConfirm} from "material-ui-confirm";
import FormDrawer from "../drawers/FormDrawer";
import {VscTrash, VscEdit} from "react-icons/vsc";
import PropTypes from "prop-types";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupHeader} from "../tui/TuiForm";
import {asyncRemote} from "../../../remote_api/entrypoint";
import TuiTags from "../tui/TuiTags";
import PropertyField from "./PropertyField";
import IconLabel from "../misc/IconLabels/IconLabel";
import FlowNodeIcons from "../../flow/FlowNodeIcons";
import Properties from "./DetailProperties";
import {isEmptyObjectOrNull} from "../../../misc/typeChecking";
import NoData from "../misc/NoData";
import ActiveTag from "../misc/ActiveTag";
import EventToProfileForm from "../forms/EventToProfileForm";

export function EventToProfileCard({data, onDeleteComplete, onEditComplete, displayMetadata=true}) {

    const [displayEdit, setDisplayEdit] = React.useState(false);
    const [deleteProgress, setDeleteProgress] = React.useState(false);

    const confirm = useConfirm();

    const onEditClick = () => {
        if (data) {
            setDisplayEdit(true);
        }
    }

    const handleEditComplete = (flowData) => {
        setDisplayEdit(false);
        if(onEditComplete instanceof Function) onEditComplete(flowData);
    }

    const onDelete = () => {
        confirm({
            title: "Do you want to delete this coping schema?",
            description: "This action can not be undone."
        })
            .then(async () => {
                    setDeleteProgress(true);
                    try {
                        await asyncRemote({
                            url: '/event-to-profile/' + data?.id,
                            method: "delete"
                        })
                        if (onDeleteComplete) {
                            onDeleteComplete(data?.id)
                        }
                    } catch (e) {

                    }
                }
            )
            .catch(() => {})
            .finally(() => {setDeleteProgress(false);})
    }

    const Details = () => <TuiForm>
        <TuiFormGroup>
            <TuiFormGroupContent>
                <PropertyField name="Event type" content={<IconLabel value={data.event_type} icon={<FlowNodeIcons icon="event"/>}/>}/>
                <PropertyField name="Name" content={data.name}/>
                <PropertyField name="Description" content={data.description}/>
                <PropertyField name="Tags" underline={false} content={<TuiTags tags={data.tags} size="small"/>}/>
            </TuiFormGroupContent>
        </TuiFormGroup>
        <TuiFormGroup>
            <TuiFormGroupHeader header="The schema for copying data from event to profile"/>
            <TuiFormGroupContent>
                <PropertyField name="Enabled" underline={false} content={<ActiveTag active={data.enabled}/>}/>
                <h3>Copy data from event to profile</h3>
                <p>This schema outlines which data from an event are copied to which profile data. e.g.
                    (event) properties.email to (profile) pii.email.</p>
                {!isEmptyObjectOrNull(data?.event_to_profile)
                    ? <Properties properties={data.event_to_profile}/>
                    : <NoData header="The schema for copying data is not set"/>
                }
            </TuiFormGroupContent>
        </TuiFormGroup>
        <Rows style={{marginTop: 20}}>
            <Button onClick={onEditClick}
                    icon={<VscEdit size={20}/>}
                    label="Edit" disabled={typeof data === "undefined"}/>
            <Button
                progress={deleteProgress}
                icon={<VscTrash size={20}/>}
                onClick={onDelete}
                label="Delete"
                disabled={typeof data === "undefined"}/>
        </Rows>
    </TuiForm>

    return <div className="Box10" style={{height: "100%"}}>
        {data && <Details/>}
        <FormDrawer
            width={800}
            onClose={() => {
                setDisplayEdit(false)
            }}
            open={displayEdit}>
            {displayEdit && <EventToProfileForm
                onSaveComplete={handleEditComplete}
                {...data}
            />}
        </FormDrawer>
    </div>
}


export default function EventToProfileDetails({id, onDeleteComplete, onEditComplete}) {

    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(false);

    useEffect(() => {
            let isSubscribed = true;
            setLoading(true);
            asyncRemote({
                url: '/event-to-profile/' + id,
                method: "get"
            })
                .then((result) => {
                    if(isSubscribed) setData(result.data);
                })
                .catch((e)=> {
                    console.log(e)
                })
                .finally(
                    () => {if(isSubscribed) setLoading(false)}
                )
            return () => isSubscribed= false;
        },
        [id])

    if (loading)
        return <CenteredCircularProgress/>

    return <EventToProfileCard data={data} onDeleteComplete={onDeleteComplete} onEditComplete={onEditComplete}/>
}

EventToProfileDetails.propTypes = {
    id: PropTypes.string,
    onDeleteComplete: PropTypes.func,
    onEditComplete: PropTypes.func
};