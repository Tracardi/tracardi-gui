import React, {useEffect, useRef} from "react";
import Rows from "../misc/Rows";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import {useConfirm} from "material-ui-confirm";
import FormDrawer from "../drawers/FormDrawer";
import {VscTrash, VscEdit} from "react-icons/vsc";
import PropTypes from "prop-types";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupHeader} from "../tui/TuiForm";
import TuiTags from "../tui/TuiTags";
import PropertyField from "./PropertyField";
import IconLabel from "../misc/IconLabels/IconLabel";
import FlowNodeIcons from "../../flow/FlowNodeIcons";
import EventRedirectForm from "../forms/EventRedirectForm";
import IdLabel from "../misc/IconLabels/IdLabel";
import {BsStar} from "react-icons/bs";
import TextField from "@mui/material/TextField";
import JsonBrowser from "../misc/JsonBrowser";
import {useRequest} from "../../../remote_api/requestClient";
import ProductionButton from "../forms/ProductionButton";

export default function EventRedirectDetails({id, onDeleteComplete, onEditComplete}) {

    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [displayEdit, setDisplayEdit] = React.useState(false);
    const [deleteProgress, setDeleteProgress] = React.useState(false);

    const confirm = useConfirm();
    const {request} = useRequest()

    const mounted = useRef(false);

    useEffect(() => {
            mounted.current = true;
            setLoading(true);
            request({
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
                        await request({
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
                    <PropertyField name="Id" content={<IdLabel label={data.id}/>}/>
                    <PropertyField name="Name" content={data.name}/>
                    <PropertyField name="Description" content={data.description}/>

                    <PropertyField name="Tags" content={<TuiTags tags={data.tags} size="small"/>}/>


                </TuiFormGroupContent>
            </TuiFormGroup>
            <TuiFormGroup>
                <TuiFormGroupContent>
                    <h3 className="flexLine"><BsStar size={20} style={{marginRight: 5}}/> Redirect URL</h3>
                    <p>This URL will redirect customer to <b>{data.url}</b> and will register a <b>{data.event_type}</b> event in
                        Tracardi along with the defined properties. Please remember to prefix the URL path with the
                        server IP where you have the <b>API-bridge</b> running.
                    </p>

                    <TextField
                        label="Event source with redirect"
                        value={`/redirect/${data.id}`}
                        size="small"
                        disabled={true}
                        variant="outlined"
                        fullWidth
                    />
                </TuiFormGroupContent>
            </TuiFormGroup>
            <TuiFormGroup>
                <TuiFormGroupHeader header="Redirection configuration"
                                    description="Information on event redirect settings."/>
                <TuiFormGroupContent>
                    <PropertyField name="Raise event type"
                                   content={<IconLabel value={data.event_type} icon={<FlowNodeIcons icon="event"/>}/>}/>
                    <PropertyField name="Event properties" content={<JsonBrowser data={data.props}/>}/>
                </TuiFormGroupContent>
            </TuiFormGroup>
        </TuiForm>
        <div>
            <Rows style={{marginTop: 20}}>
                <ProductionButton
                    onClick={onEditClick}
                    icon={<VscEdit size={20}/>}
                    label="Edit" disabled={typeof data === "undefined"}/>
                <ProductionButton
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