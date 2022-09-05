import React, {useEffect, useRef} from "react";
import Button from "../forms/Button";
import Rows from "../misc/Rows";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import {useConfirm} from "material-ui-confirm";
import FormDrawer from "../drawers/FormDrawer";
import {VscTrash, VscEdit} from "react-icons/vsc";
import PropTypes from "prop-types";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import {asyncRemote} from "../../../remote_api/entrypoint";
import EventManagementForm from "../forms/EventManagementForm";
import TuiTags from "../tui/TuiTags";
import {ObjectInspector} from "react-inspector";
import Tag from "../misc/Tag";

export default function EventManagementDetails({id, onDeleteComplete, onEditComplete}) {

    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [displayEdit, setDisplayEdit] = React.useState(false);
    const [deleteProgress, setDeleteProgress] = React.useState(false);

    const confirm = useConfirm();

    const mounted = useRef(false);

    useEffect(() => {
            mounted.current = true;
            setLoading(true);
            asyncRemote({
                url: '/event-type/management/' + id,
                method: "get"
            })
                .then((result) => {
                    if(mounted.current) setData(result.data);
                })
                .catch()
                .finally(
                    () => {if(mounted.current) setLoading(false)}
                )
            return () => mounted.current = false;
        },
        [id])

    const onEditClick = () => {
        if (data) {
            setDisplayEdit(true);
        }
    }

    const onDelete = () => {
        confirm({title: "Do you want to delete this event type metadata?", description: "This action can not be undone."})
            .then(async () => {
                if(mounted.current) setDeleteProgress(true);
                    try {
                        await asyncRemote({
                            url: '/event-type/management/' + id,
                            method: "delete"
                        })
                        if (onDeleteComplete) {
                            onDeleteComplete(data.id)
                        }
                    } catch (e) {

                    }
                }
            )
            .catch(() => {})
            .finally(() => {if(mounted.current) setDeleteProgress(false);})
    }

    const Details = () => <TuiForm>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Event type metadata" description="Information on event type"/>
            <TuiFormGroupContent>
                <TuiFormGroupField header={`${data.name} (${data.event_type})`} description={data.description}>
                    <TuiTags tags={data.tags}/>
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
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Json schema validation"/>
            <TuiFormGroupContent>
                <ObjectInspector data={data.validation.json_schema || {}} expandLevel={3}/>
                {data.validation && <div style={{marginTop: 10}}>
                    <Tag backgroundColor={data.validation?.enabled ? "#00c49f" : "#d81b60"} color="white">{data.validation?.enabled ? "enabled" : "disabled"}</Tag>
                </div>}
            </TuiFormGroupContent>
        </TuiFormGroup>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Event reshaping settings"/>
            <TuiFormGroupContent>
            <TuiFormGroupField header="Reshape when condition is met">
                    {data.reshaping.condition || "No condition provided"}
                </TuiFormGroupField>
                <TuiFormGroupField header="Reshape template">
                    <ObjectInspector data={data.reshaping.template || {}} expandLevel={3}/>
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
    </TuiForm>

    return <div className="Box10" style={{height: "100%"}}>
        {loading && <CenteredCircularProgress/>}
        {data && <Details/>}
        <FormDrawer
            width={800}
            label="Edit schema"
            onClose={() => {
                setDisplayEdit(false)
            }}
            open={displayEdit}>
            {displayEdit && <EventManagementForm
                onSaveComplete={onEditComplete}
                {...data}
            />}
        </FormDrawer>
    </div>
}

EventManagementDetails.propTypes = {
    id: PropTypes.string,
    onDeleteComplete: PropTypes.func,
    onEditComplete: PropTypes.func
};