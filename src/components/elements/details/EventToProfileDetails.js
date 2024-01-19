import React, {useEffect} from "react";
import Button from "../forms/Button";
import Rows from "../misc/Rows";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import {useConfirm} from "material-ui-confirm";
import FormDrawer from "../drawers/FormDrawer";
import {VscTrash, VscEdit} from "react-icons/vsc";
import PropTypes from "prop-types";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupHeader} from "../tui/TuiForm";
import {isEmptyObjectOrNull} from "../../../misc/typeChecking";
import NoData from "../misc/NoData";
import EventToProfileForm from "../forms/EventToProfileForm";
import EventTypeMetadata from "./EventTypeMetadata";
import MappingsObjectDetails from "./MappingsObjectDetails";
import Tag from "../misc/Tag";
import {RestrictToContext} from "../../context/RestrictContext";
import {useRequest} from "../../../remote_api/requestClient";

export function EventToProfileCard({data, onDeleteComplete, onEditComplete, displayMetadata=true}) {

    const [displayEdit, setDisplayEdit] = React.useState(false);
    const [deleteProgress, setDeleteProgress] = React.useState(false);

    const confirm = useConfirm();
    const {request} = useRequest()

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
                        await request({
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

    const Details = () => <>
        <TuiForm>
            {displayMetadata && <EventTypeMetadata data={data}/>}
            <TuiFormGroup>
                <TuiFormGroupHeader header="Trigger condition" description="Event data will be copied only if the below condition is met."/>
                <TuiFormGroupContent>
                    <div style={{fontSize: 18, marginBottom: 5}}><Tag backgroundColor="black" color="white">when</Tag>event type <Tag>equals</Tag>{data?.event_type?.id}</div>
                    {data?.config?.condition && <div style={{fontSize: 18}}>
                        <fieldset style={{borderWidth: "1px 0 0 0", borderRadius: 0, marginTop: 8}}>
                            <legend style={{padding: "0 10px"}}>AND</legend>
                            <Tag backgroundColor="black" color="white">if</Tag>{data.config.condition}
                        </fieldset>
                    </div>}
                </TuiFormGroupContent>
            </TuiFormGroup>
            <TuiFormGroup>
                <TuiFormGroupHeader header="Event to profile mapping"
                                    description="This schema outlines which data from an event are copied to which profile data. e.g.
                    (profile) data.contact.email.private equals (event) properties.email."/>

                <TuiFormGroupContent>
                    {!isEmptyObjectOrNull(data?.event_to_profile)
                        ? <MappingsObjectDetails
                            properties={data.event_to_profile}
                            keyPrefix="event@"
                            valuePrefix="profile@"
                        />
                        : <NoData header="No schema defined"/>
                    }
                </TuiFormGroupContent>
            </TuiFormGroup>

        </TuiForm>
        {!data.build_in && <RestrictToContext>
            <div style={{marginBottom: 20, marginTop: 20}}>
                <Rows>
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
            </div>
        </RestrictToContext>}
    </>

    return <div className="Box10" style={{height: "100%"}}>
        {data && <Details/>}
        <FormDrawer
            width={800}
            onClose={() => {
                setDisplayEdit(false)
            }}
            open={displayEdit}>
            {displayEdit && <EventToProfileForm
                onSubmit={handleEditComplete}
                {...data}
            />}
        </FormDrawer>
    </div>
}


export default function EventToProfileDetails({id, onDeleteComplete, onEditComplete}) {

    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(false);

    const {request} = useRequest()

    useEffect(() => {
            let isSubscribed = true;
            setLoading(true);
            request({
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