import React, {useEffect, useRef} from "react";
import Properties from "./DetailProperties";
import Button from "../forms/Button";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import {useConfirm} from "material-ui-confirm";
import FormDrawer from "../drawers/FormDrawer";
import {VscTrash, VscEdit} from "react-icons/vsc";
import PropTypes from "prop-types";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import {asyncRemote} from "../../../remote_api/entrypoint";
import DataComplianceForm from "../forms/DataComplianceForm";

export default function DataComplianceDetails({id, onDeleteComplete, onEditComplete}) {

    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [displayEdit, setDisplayEdit] = React.useState(false);
    const [deleteProgress, setDeleteProgress] = React.useState(false);

    const confirm = useConfirm();

    const mounted = useRef(false);

    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);

    useEffect(() => {
            setLoading(true);
            asyncRemote({
                url: '/consent/compliance/field/' + id,
                method: "get"
            })
                .then((result) => {
                    if(mounted.current) setData(result.data);
                })
                .catch()
                .finally(
                    () => {if(mounted.current) setLoading(false)}
                )
        },
        [id])

    const onEditClick = () => {
        if (data) {
            setDisplayEdit(true);
        }
    }

    const onDelete = () => {
        confirm({title: "Do you want to delete this data compliance requirement?", description: "This action can not be undone."})
            .then(async () => {
                    setDeleteProgress(true);
                    try {
                        await asyncRemote({
                            url: '/consent/compliance/field/' + id,
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
            }).finally(() => {
            setDeleteProgress(false);
        })
    }

    const Details = () => <>
        <div style={{margin: "20px 0", display: "flex", justifyContent: "flex-end"}}>
            <Button onClick={onEditClick}
                    icon={<VscEdit size={20}/>}
                    label="Edit" disabled={typeof data === "undefined"}/>
            <Button
                progress={deleteProgress}
                icon={<VscTrash size={20}/>}
                onClick={onDelete}
                label="Delete"
                disabled={typeof data === "undefined"}/>
        </div>
        <TuiForm>

        <TuiFormGroup>
            <TuiFormGroupHeader header="Data compliance properties"/>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Data">
                    <Properties properties={data}/>
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
    </TuiForm></>

    return <div className="Box10" style={{height: "100%"}}>
        {loading && <CenteredCircularProgress/>}
        {data && <Details/>}
        <FormDrawer
            width={800}
            onClose={() => {
                setDisplayEdit(false)
            }}
            open={displayEdit}>
            {displayEdit && <DataComplianceForm
                onSaveComplete={onEditComplete}
                {...data}
            />}
        </FormDrawer>
    </div>
}

DataComplianceDetails.propTypes = {
    id: PropTypes.string,
    onDeleteComplete: PropTypes.func,
    onEditComplete: PropTypes.func
};