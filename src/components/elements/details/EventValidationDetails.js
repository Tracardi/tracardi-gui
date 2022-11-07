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

export default function EventValidationDetails({id, onDeleteComplete}) {

    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [displayEdit, setDisplayEdit] = React.useState(false);

    const confirm = useConfirm();

    useEffect(() => {
            let isSubscribed = true;
            setLoading(true);

            asyncRemote({
                url: '/event-validator/' + id,
                method: "get"
            }).then(resposne => {
                if (isSubscribed === true) setData(resposne.data);
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

    const onEditClick = () => {
        if (data) {
            setDisplayEdit(true);
        }
    }

    const onEditComplete = (flowData) => {
        setData(flowData);
        setDisplayEdit(false);
    }

    const onDelete = () => {
        confirm({title: "Do you want to delete this event schema validation?", description: "This action can not be undone."})
            .then(async () => {
                    try {
                        await asyncRemote({
                            url: '/event-validator/' + id,
                            method: "delete"
                        })
                        if (onDeleteComplete) {
                            onDeleteComplete(id)
                        }
                    } catch (e) {
                        console.error(e)
                    }
                }
            )
            .catch(() => {
            })
    }

    const Details = () => <TuiForm>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Event validation schema" description="Information on validation reshaping."/>
            <TuiFormGroupContent>
                <TuiFormGroupField>
                    <Properties properties={data}/>
                    <Rows style={{marginTop: 20}}>
                        <Button onClick={onEditClick}
                                icon={<VscEdit size={20}/>}
                                label="Edit"
                                disabled={typeof data === "undefined"}/>
                        {onDeleteComplete && <Button
                            icon={<VscTrash size={20}/>}
                            onClick={onDelete}
                            label="Delete"
                            disabled={typeof data === "undefined"}
                        />}
                    </Rows>
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
    </TuiForm>

    return <div className="Box10" style={{height: "100%"}}>
        {loading && <CenteredCircularProgress/>}
        {data && <Details/>}
        <FormDrawer
            width={800}
            onClose={() => {
                setDisplayEdit(false)
            }}
            open={displayEdit}>
            {displayEdit && <EventValidationForm
                onSubmit={onEditComplete}
                init={data}
            />}
        </FormDrawer>
    </div>
}

EventValidationDetails.propTypes = {
    id: PropTypes.string,
    onDeleteComplete: PropTypes.func,
};