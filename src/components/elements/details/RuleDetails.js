import React, {useEffect, useRef} from "react";
import "./Details.css";
import "./RuleDetails.css";
import Button from "../forms/Button";
import UqlDetails from "./UqlDetails";
import Rows from "../misc/Rows";
import {VscTrash} from "@react-icons/all-files/vsc/VscTrash";
import {VscEdit} from "@react-icons/all-files/vsc/VscEdit";
import PropTypes from "prop-types";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import {asyncRemote} from "../../../remote_api/entrypoint";
import {useConfirm} from "material-ui-confirm";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import FormDrawer from "../drawers/FormDrawer";
import RuleForm from "../forms/RuleForm";


function RuleDetails({id, onDelete, onEdit}) {

    const [loading, setLoading] = React.useState(false);
    const [deleteProgress, setDeleteProgress] = React.useState(false);
    const [data, setData] = React.useState(null);
    const [openEdit, setOpenEdit] = React.useState(false);

    const mounted = useRef(false);
    const confirm = useConfirm()

    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);

    useEffect(() => {
        setLoading(true);
        asyncRemote({
                url: '/rule/' + id,
                method: "get"
            }
        ).then((response) => {
            if (response?.data) {
                setData(response?.data)
            }
        }).catch((e) => {
            if (e) {

            }
        }).finally(
            () => {
                if (mounted) {
                    setLoading(false)
                }
            }
        )
    }, [id])

    const handleEdit = () => {
        setOpenEdit(true)
    }

    const handleDelete = () => {
        confirm({title: "Do you want to delete this rule?", description: "This action can not be undone."})
            .then(async () => {
                    setDeleteProgress(true);
                    await asyncRemote({
                        url: '/rule/' + id,
                        method: "delete"
                    })
                    if (onDelete) {
                        onDelete(data.id)
                    }
                }
            )
            .catch(
                () => {
                }
            ).finally(() => {
                if (mounted) {
                    setDeleteProgress(false);
                }
            }
        )
    }

    return <>
        {loading && <CenteredCircularProgress/>}
        {!loading && <TuiForm style={{margin: 20}}>
        <TuiFormGroup>
            <TuiFormGroupHeader header={data?.name}
                                description="Please find below rule logic that will trigger the workflow."/>
            <TuiFormGroupContent>
                <TuiFormGroupContent>
                    <TuiFormGroupField description={data?.description}>
                        {data && <UqlDetails data={data} type="Rule"/>}

                        <Rows style={{marginTop: 20}}>
                            {handleEdit && <Button onClick={handleEdit}
                                                   icon={<VscEdit size={20}/>}
                                                   label="Edit"
                                                   disabled={typeof data === "undefined"}/>}
                            {handleDelete && <Button onClick={handleDelete}
                                                     progress={deleteProgress}
                                                     label="Delete"
                                                     icon={<VscTrash size={20} style={{marginRight: 5}}/>}
                                                     disabled={typeof data === "undefined"}/>}
                        </Rows>
                    </TuiFormGroupField>
                </TuiFormGroupContent>
            </TuiFormGroupContent>
        </TuiFormGroup>
            <FormDrawer
                width={700}
                label="Edit rule"
                onClose={() => {
                    setOpenEdit(false)
                }}
                open={openEdit}>
                {openEdit && <RuleForm
                    onEnd={onEdit}
                    init={data}
                />}
            </FormDrawer>
    </TuiForm>}
    </>

}

RuleDetails.propTypes = {
    id: PropTypes.string,
    onDelete: PropTypes.func,
    onEdit: PropTypes.func,
};

export default RuleDetails;
