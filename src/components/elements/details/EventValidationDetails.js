import React, {useEffect} from "react";
import Properties from "./DetailProperties";
import Button from "../forms/Button";
import Rows from "../misc/Rows";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import {useConfirm} from "material-ui-confirm";
import FormDrawer from "../drawers/FormDrawer";
import {VscTrash, VscEdit} from "react-icons/vsc";
import PropTypes from "prop-types";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import {asyncRemote} from "../../../remote_api/entrypoint";
import EventValidationForm from "../forms/EventValidationForm";
import MappingsObjectDetails from "./MappingsObjectDetails";
import JsonBrowser from "../misc/JsonBrowser";
import {isEmptyObject} from "../../../misc/typeChecking";
import NoData from "../misc/NoData";

export function EventValidationCard({data, onDeleteComplete, onEditComplete, displayMetadata=true}) {

    const [displayEdit, setDisplayEdit] = React.useState(false);

    const confirm = useConfirm();

    const handleEditClick = () => {
        if (data) {
            setDisplayEdit(true);
        }
    }

    const handleEditComplete = (flowData) => {
        setDisplayEdit(false);
        if (onEditComplete instanceof Function) {
            onEditComplete(flowData)
        }
    }

    const handleDelete = () => {
        confirm({title: "Do you want to delete this event schema validation?", description: "This action can not be undone."})
            .then(async () => {
                    try {
                        await asyncRemote({
                            url: '/event-validator/' + data.id,
                            method: "delete"
                        })
                        if (onDeleteComplete instanceof Function) {
                            onDeleteComplete(data.id)
                        }
                    } catch (e) {
                        console.error(e)
                    }
                }
            )
            .catch(() => {
            })
    }

    const Details = () => <>
        <TuiForm>
            {displayMetadata && <TuiFormGroup>
                <TuiFormGroupContent>
                <TuiFormGroupField>
                    <Properties properties={data} show={['id', 'event_type', 'name', 'description', 'tags']}/>
                </TuiFormGroupField>
            </TuiFormGroupContent>
            </TuiFormGroup> }
            {data.validation.condition && <TuiFormGroup>
                <TuiFormGroupHeader header="Trigger condition"
                                    description="This validation schema is triggered only when."/>
                <TuiFormGroupContent>
                    <span style={{fontSize: 24}}>
                       {data.validation.condition}
                    </span>
                </TuiFormGroupContent>
            </TuiFormGroup>}
            {!isEmptyObject(data?.validation?.json_schema) ? <TuiFormGroup>
                <TuiFormGroupHeader header="Event validation schema"
                                    description="Validation is described by JSON Schema format.
                                    JSON Schema is a declarative language that allows you to annotate and
                                    validate JSON documents."/>
                <TuiFormGroupContent>
                    <TuiFormGroupField>
                        <JsonBrowser data={data.validation.json_schema} />

                    </TuiFormGroupField>
                </TuiFormGroupContent>
            </TuiFormGroup>: <NoData header="No schema defined"/> }
        </TuiForm>
        <div style={{marginBottom: 20}}>
            <Rows style={{marginTop: 20}}>
                <Button onClick={handleEditClick}
                        icon={<VscEdit size={20}/>}
                        label="Edit"
                        disabled={typeof data === "undefined"}/>
                {onDeleteComplete && <Button
                    icon={<VscTrash size={20}/>}
                    onClick={handleDelete}
                    label="Delete"
                    disabled={typeof data === "undefined"}
                />}
            </Rows>
        </div>
    </>

    return <div className="Box10" style={{height: "100%"}}>
        {data && <Details/>}
        <FormDrawer
            width={800}
            onClose={() => {
                setDisplayEdit(false)
            }}
            open={displayEdit}>
            {displayEdit && <EventValidationForm
                onSubmit={handleEditComplete}
                init={data}
            />}
        </FormDrawer>
    </div>
}

export default function EventValidationDetails({id, onDeleteComplete}) {

    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(false);

    useEffect(() => {
            let isSubscribed = true;
            setLoading(true);

            asyncRemote({
                url: '/event-validator/' + id,
                method: "get"
            }).then(response => {
                if (isSubscribed === true) setData(response.data);
            }).catch((e) => {
                console.error(e)
            }).finally(() => {
                    if (isSubscribed === true) setLoading(false)
                }
            )

            return () => {
                isSubscribed = false
            }
        },
        [id])

    if(loading)
        return <CenteredCircularProgress/>

    return <EventValidationCard data={data} onDeleteComplete={onDeleteComplete} onEditComplete={(data) => setData(data)}/>

}

EventValidationDetails.propTypes = {
    id: PropTypes.string,
    onDeleteComplete: PropTypes.func,
};