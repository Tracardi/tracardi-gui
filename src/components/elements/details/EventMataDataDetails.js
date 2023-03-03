import React, {useEffect} from "react";
import Button from "../forms/Button";
import Rows from "../misc/Rows";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import {useConfirm} from "material-ui-confirm";
import FormDrawer from "../drawers/FormDrawer";
import {VscTrash, VscEdit} from "react-icons/vsc";
import PropTypes from "prop-types";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupHeader} from "../tui/TuiForm";
import {asyncRemote} from "../../../remote_api/entrypoint";
import EventMetadataForm from "../forms/EventMetadataForm";
import TuiTags from "../tui/TuiTags";
import PropertyField from "./PropertyField";
import IconLabel from "../misc/IconLabels/IconLabel";
import FlowNodeIcons from "../../flow/FlowNodeIcons";
import Properties from "./DetailProperties";
import {isEmptyObjectOrNull} from "../../../misc/typeChecking";
import NoData from "../misc/NoData";
import ActiveTag from "../misc/ActiveTag";

export function EventMetaDataCard({data, onDeleteComplete, onEditComplete, displayMetadata=true}) {

    const [displayEdit, setDisplayEdit] = React.useState(false);
    const [deleteProgress, setDeleteProgress] = React.useState(false);

    const confirm = useConfirm();

    const handleEdit = () => {
        if (data) {
            setDisplayEdit(true);
        }
    }

    const handleEditComplete = (flowData) => {
        setDisplayEdit(false);
        if(onEditComplete instanceof Function) onEditComplete(flowData);
    }

    const handleDelete = () => {
        confirm({
            title: "Do you want to delete this event type metadata?",
            description: "This action can not be undone."
        })
            .then(async () => {
                    setDeleteProgress(true);
                    try {
                        await asyncRemote({
                            url: '/event-type/management/' + data?.id,
                            method: "delete"
                        })
                        if (onDeleteComplete) {
                            onDeleteComplete(data?.id)
                        }
                    } catch (e) {

                    }
                }
            )
            .catch(() => {
            })
            .finally(() => {
                setDeleteProgress(false);
            })
    }

    const Details = () => <TuiForm>
        {displayMetadata && <TuiFormGroup>
            <TuiFormGroupContent>
                <PropertyField name="Event type"
                               content={<IconLabel value={data.event_type} icon={<FlowNodeIcons icon="event"/>}/>}/>
                <PropertyField name="Name" content={data.name}/>
                <PropertyField name="Description" content={data.description}/>
                <PropertyField name="Tags" underline={false} content={<TuiTags tags={data.tags} size="small"/>}/>
            </TuiFormGroupContent>
        </TuiFormGroup>}
        <TuiFormGroup>
            <TuiFormGroupHeader header="Event data indexing"/>
            <TuiFormGroupContent>
                <PropertyField name="Indexing enabled" underline={false}
                               content={<ActiveTag active={data.index_enabled}/>}/>
                <h3>Property to Trait Indexing Schema</h3>
                <p>This is the schema describing how properties are indexed as traits. Indexed property is removed from
                    properties.</p>
                {!isEmptyObjectOrNull(data?.index_schema)
                    ? <Properties properties={data.index_schema}/>
                    : <NoData header="No data indexing is set">
                        <span style={{textAlign: "center"}}>Data is stored in event properties, it can be searched but it will not be visible as event traits, and no reporting will be possible.</span>
                    </NoData>
                }
            </TuiFormGroupContent>
        </TuiFormGroup>
        <Rows style={{marginTop: 20}}>
            <Button onClick={handleEdit}
                    icon={<VscEdit size={20}/>}
                    label="Edit" disabled={typeof data === "undefined"}/>
            <Button
                progress={deleteProgress}
                icon={<VscTrash size={20}/>}
                onClick={handleDelete}
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
            {displayEdit && <EventMetadataForm
                onSubmit={handleEditComplete}
                {...data}
            />}
        </FormDrawer>
    </div>
}


export default function EventMataDataDetails({id, onDeleteComplete, onEditComplete}) {

    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(false);

    useEffect(() => {
            let isSubscribed = true;
            setLoading(true);
            asyncRemote({
                url: '/event-type/management/' + id,
                method: "get"
            })
                .then((result) => {
                    if (isSubscribed) setData(result.data);
                })
                .catch((e) => {
                    console.log(e)
                })
                .finally(
                    () => {
                        if (isSubscribed) setLoading(false)
                    }
                )
            return () => isSubscribed = false;
        },
        [id])

    const handleEditComplete = (data) => {
        setData(data)
        if (onEditComplete instanceof Function) {
            onEditComplete(data)
        }
    }

    if (loading) return <CenteredCircularProgress/>

    return <EventMetaDataCard data={data} onDeleteComplete={onDeleteComplete} onEditComplete={handleEditComplete}/>
}

EventMataDataDetails.propTypes = {
    id: PropTypes.string,
    onDeleteComplete: PropTypes.func,
    onEditComplete: PropTypes.func
};