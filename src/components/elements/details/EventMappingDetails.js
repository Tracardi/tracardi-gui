import React, {useEffect} from "react";
import Button from "../forms/Button";
import Rows from "../misc/Rows";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import {useConfirm} from "material-ui-confirm";
import FormDrawer from "../drawers/FormDrawer";
import {VscTrash, VscEdit} from "react-icons/vsc";
import PropTypes from "prop-types";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupHeader} from "../tui/TuiForm";
import EventMappingForm from "../forms/EventMappingForm";
import TuiTags from "../tui/TuiTags";
import PropertyField from "./PropertyField";
import IconLabel from "../misc/IconLabels/IconLabel";
import FlowNodeIcons from "../../flow/FlowNodeIcons";
import {isEmptyObjectOrNull} from "../../../misc/typeChecking";
import NoData from "../misc/NoData";
import ActiveTag from "../misc/ActiveTag";
import {RestrictToLocalStagingContext} from "../../context/RestrictContext";
import {objectMap} from "../../../misc/mappers";
import AssignValueToKey from "./AssignValueToKey";
import {useRequest} from "../../../remote_api/requestClient";

export function EventMappingCard({data, onDeleteComplete, onEditComplete, displayMetadata = true}) {

    const [displayEdit, setDisplayEdit] = React.useState(false);
    const [deleteProgress, setDeleteProgress] = React.useState(false);

    const confirm = useConfirm();
    const {request} = useRequest()

    const handleEdit = () => {
        if (data) {
            setDisplayEdit(true);
        }
    }

    const handleEditComplete = (flowData) => {
        setDisplayEdit(false);
        if (onEditComplete instanceof Function) onEditComplete(flowData);
    }

    const handleDelete = () => {
        confirm({
            title: "Do you want to delete this event type metadata?",
            description: "This action can not be undone."
        })
            .then(async () => {
                    setDeleteProgress(true);
                    try {
                        await request({
                            url: '/event-type/mapping/' + data?.id,
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
                <PropertyField name="Event type Id"
                               content={<IconLabel value={data.event_type} icon={<FlowNodeIcons icon="event"/>}/>}/>
                <PropertyField name="Name" content={data.name}/>
                <PropertyField name="Description" content={data.description}/>

                <PropertyField name="Tags"
                               content={<TuiTags tags={data.tags} size="small"/>}/>
                <PropertyField name="Indexing enabled" underline={false}
                               content={<ActiveTag active={data.enabled}/>}/>
            </TuiFormGroupContent>
        </TuiFormGroup>}
        <TuiFormGroup>

            <TuiFormGroupHeader header="Event Journey Mapping"/>
            <TuiFormGroupContent>
                {data.journey ? <PropertyField name="Journey stage" content={data.journey} underline={false}/>
                : <NoData header="No journey mapping">
                        <span style={{textAlign: "center"}}>This event type is not mapped to any customer journey state.</span>
                    </NoData>}
            </TuiFormGroupContent>
        </TuiFormGroup>
        <TuiFormGroup>

            <TuiFormGroupHeader header="Event Properties Mapping"
                                description="The schema outlines how properties are transferred to data or traits.
                                Properties are not mandatory, and if a property is not set, it will not be
                                transferred, and no error will occur."
            />
            <TuiFormGroupContent>
                {!isEmptyObjectOrNull(data?.index_schema) ?
                    objectMap(data?.index_schema, (key, value) => {
                        return <AssignValueToKey key={key} value={`event@properties.${key}`} label={`event@traits.${value}`} op="moves to"/>
                    }) : <NoData header="No data mapping">
                        <span style={{textAlign: "center"}}>Data is stored in event properties, it can be searched but it will not be visible as event traits, and no reporting will be possible.</span>
                    </NoData>
                }
            </TuiFormGroupContent>
        </TuiFormGroup>
        {!data.build_in && <RestrictToLocalStagingContext>
            <Rows style={{marginTop: 20, marginBottom: 20}}>
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
        </RestrictToLocalStagingContext>}
    </TuiForm>

    return <div className="Box10" style={{height: "100%"}}>
        {data && <Details/>}
        <FormDrawer
            width={800}
            onClose={() => {
                setDisplayEdit(false)
            }}
            open={displayEdit}>
            {displayEdit && <EventMappingForm
                onSubmit={handleEditComplete}
                {...data}
            />}
        </FormDrawer>
    </div>
}

export default function EventMappingDetails({id, onDeleteComplete, onEditComplete}) {

    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(false);

    const {request} = useRequest()

    useEffect(() => {
            let isSubscribed = true;
            setLoading(true);
            request({
                url: '/event-type/mapping/' + id,
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

    return <EventMappingCard data={data} onDeleteComplete={onDeleteComplete} onEditComplete={handleEditComplete}/>
}

EventMappingDetails.propTypes = {
    id: PropTypes.string,
    onDeleteComplete: PropTypes.func,
    onEditComplete: PropTypes.func
};