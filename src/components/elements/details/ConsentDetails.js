import React, {useEffect} from "react";
import Properties from "./DetailProperties";
import Button from "../forms/Button";
import Rows from "../misc/Rows";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import {useConfirm} from "material-ui-confirm";
import FormDrawer from "../drawers/FormDrawer";
import {VscTrash} from "@react-icons/all-files/vsc/VscTrash";
import {VscEdit} from "@react-icons/all-files/vsc/VscEdit";
import PropTypes from "prop-types";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import {asyncRemote} from "../../../remote_api/entrypoint";
import ConsentForm from "../forms/ConsentForm";

export default function ConsentDetails({id, onDeleteComplete, onEditComplete}) {

    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [displayEdit, setDisplayEdit] = React.useState(false);
    const [deleteProgress, setDeleteProgress] = React.useState(false);

    const confirm = useConfirm();

    useEffect(() => {
            setLoading(true);
            asyncRemote({
                url: '/consent/type/' + id,
                method: "get"
            })
                .then((result) => {
                    setData(result.data);
                })
                .catch()
                .finally(
                    () => setLoading(false)
                )
        },
        [id])

    const onEditClick = () => {
        if (data) {
            setDisplayEdit(true);
        }
    }

    const onDelete = () => {
        confirm({title: "Do you want to delete this consent type?", description: "This action can not be undone."})
            .then(async () => {
                    setDeleteProgress(true);
                    try {
                        const response = await asyncRemote({
                            url: '/consent/type/' + id,
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

    const Details = () => <TuiForm>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Consent type" description="Information on consent type"/>
            <TuiFormGroupContent>
                <TuiFormGroupField header={data.name} description={data.description}>
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
            <TuiFormGroupHeader header="Consent type properties"/>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Data">
                    <Properties properties={data}/>
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
    </TuiForm>

    console.log(data)

    return <div className="Box10" style={{height: "100%"}}>
        {loading && <CenteredCircularProgress/>}
        {data && <Details/>}
        <FormDrawer
            width={800}
            label="Edit Flow"
            onClose={() => {
                setDisplayEdit(false)
            }}
            open={displayEdit}>
            {displayEdit && <ConsentForm
                onSaveComplete={onEditComplete}
                {...data}
            />}
        </FormDrawer>
    </div>
}

ConsentDetails.propTypes = {
    id: PropTypes.string,
    onDeleteComplete: PropTypes.func,
    onEditComplete: PropTypes.func
};