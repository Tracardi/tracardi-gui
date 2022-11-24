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
import {ObjectInspector} from "react-inspector";
import theme from "../../../themes/inspector_light_theme";
import EventRedirectForm from "../forms/EventRedirectForm";

export default function EventRedirectDetails({id, onDeleteComplete, onEditComplete}) {

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
                url: '/event-redirect/' + id,
                method: "get"
            })
                .then((result) => {
                    if (mounted.current) setData(result.data);
                })
                .catch((e) => {
                    console.log(e)
                })
                .finally(
                    () => {
                        if (mounted.current) setLoading(false)
                    }
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
        confirm({
            title: "Do you want to delete this event redirect?",
            description: "This action can not be undone."
        })
            .then(async () => {
                    if (mounted.current) setDeleteProgress(true);
                    try {
                        await asyncRemote({
                            url: '/event-redirect/' + id,
                            method: "delete"
                        })
                        if (onDeleteComplete) {
                            onDeleteComplete(data.id)
                        }
                    } catch (e) {

                    }
                }
            )
            .catch(() => {
            })
            .finally(() => {
                if (mounted.current) setDeleteProgress(false);
            })
    }

    const Details = () => <>
        <TuiForm>
            <TuiFormGroup>
                <TuiFormGroupHeader header="Event redirection description"/>
                <TuiFormGroupContent>

                    <PropertyField name="Name" content={data.name}/>
                    <PropertyField name="Description" content={data.description}/>

                    <PropertyField name="Tags" content={<TuiTags tags={data.tags} size="small"/>}/>


                </TuiFormGroupContent>
            </TuiFormGroup>
            <TuiFormGroup>
                <TuiFormGroupHeader header="Redirection configuration" description="Information on event redirect settings."/>
                <TuiFormGroupContent>
                    <PropertyField name="Raise event type"
                                   content={<IconLabel value={data.event_type} icon={<FlowNodeIcons icon="event"/>}/>}/>
                    <PropertyField name="Event properties" content={<ObjectInspector data={data.props}
                                                                                     theme={theme}
                                                                                     expandLevel={3}/>}/>
                </TuiFormGroupContent>
            </TuiFormGroup>
        </TuiForm>
        <div>
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
        </div>

    </>

    return <div className="Box10" style={{height: "100%"}}>
        {loading && <CenteredCircularProgress/>}
        {data && <Details/>}
        <FormDrawer
            width={600}
            onClose={() => {
                setDisplayEdit(false)
            }}
            open={displayEdit}>
            {displayEdit && <EventRedirectForm
                onSaveComplete={onEditComplete}
                {...data}
            />}
        </FormDrawer>
    </div>
}

EventRedirectDetails.propTypes = {
    id: PropTypes.string,
    onDeleteComplete: PropTypes.func,
    onEditComplete: PropTypes.func
};