import React, {useEffect, useRef} from "react";
import Properties from "./DetailProperties";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import {useConfirm} from "material-ui-confirm";
import FormDrawer from "../drawers/FormDrawer";
import {VscTrash, VscEdit} from "react-icons/vsc";
import PropTypes from "prop-types";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import DataComplianceForm from "../forms/DataComplianceForm";
import {useRequest} from "../../../remote_api/requestClient";
import ProductionButton from "../forms/ProductionButton";

export default function DataComplianceDetails({id, onDeleteComplete, onEditComplete}) {

    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [displayEdit, setDisplayEdit] = React.useState(false);
    const [deleteProgress, setDeleteProgress] = React.useState(false);

    const confirm = useConfirm();
    const {request} = useRequest()

    const mounted = useRef(false);

    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);

    useEffect(() => {
            setLoading(true);
            request({
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

    const handleEdit = () => {
        if (data) {
            setDisplayEdit(true);
        }
    }

    const onDelete = () => {
        confirm({title: "Do you want to delete this data compliance requirement?", description: "This action can not be undone."})
            .then(async () => {
                    setDeleteProgress(true);
                    try {
                        await request({
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
            <ProductionButton
                onClick={handleEdit}
                icon={<VscEdit size={20}/>}
                label="Edit" disabled={typeof data === "undefined"}/>
            <ProductionButton
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
            width={1500}
            onClose={() => {
                setDisplayEdit(false)
            }}
            open={displayEdit}>
            {displayEdit && <DataComplianceForm
                onSaveComplete={onEditComplete}
                data={data}
            />}
        </FormDrawer>
    </div>
}

DataComplianceDetails.propTypes = {
    id: PropTypes.string,
    onDeleteComplete: PropTypes.func,
    onEditComplete: PropTypes.func
};