import React, {useEffect, useRef} from "react";
import "./Details.css";
import "./RuleDetails.css";
import Button from "../forms/Button";
import PropTypes from "prop-types";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import {asyncRemote} from "../../../remote_api/entrypoint";
import {useConfirm} from "material-ui-confirm";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import FormDrawer from "../drawers/FormDrawer";
import Properties from "./DetailProperties";
import DestinationForm from "../forms/DestinationForm";


function DestinationDetails({id, onDelete, onEdit}) {

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
                url: '/destination/' + id,
                method: "get"
            }
        ).then((response) => {
            if (response?.data && mounted.current) {
                setData({...response?.data,
                    mapping: JSON.stringify(response?.data.mapping, null, " "),
                    config: JSON.stringify(response?.data.config, null, " ")
                })
            }
        }).catch((e) => {
            if (e && mounted.current) {

            }
        }).finally(
            () => {
                if (mounted.current) {
                    setLoading(false)
                }
            }
        )
    }, [id])

    const handleEdit = () => {
        setOpenEdit(true)
    }

    const handleDelete = () => {
        confirm({title: "Do you want to delete this destination?", description: "This action can not be undone."})
            .then(async () => {
                    setDeleteProgress(true);
                    await asyncRemote({
                        url: '/destination/' + id,
                        method: "delete"
                    })
                    if (onDelete && mounted.current === true) {
                        onDelete(data.id)
                    }
                }
            )
            .catch(
                () => {
                }
            ).finally(() => {
                if (mounted.current === true) {
                    setDeleteProgress(false);
                }
            }
        )
    }

    return <>
        {loading && <CenteredCircularProgress/>}
        {!loading && <TuiForm style={{margin: 20}}>
            <TuiFormGroup>
                <TuiFormGroupHeader header={data?.name}/>
                <TuiFormGroupContent>
                    <TuiFormGroupContent>
                        <TuiFormGroupField description={data?.description}>
                            <Properties properties={data}/>
                        </TuiFormGroupField>
                    </TuiFormGroupContent>
                </TuiFormGroupContent>
            </TuiFormGroup>
            <div style={{display: "flex"}}>
                <Button label="Edit" onClick={handleEdit}/>
                <Button label="Delete" onClick={handleDelete} progress={deleteProgress}/>
            </div>

            <FormDrawer
                width={750}
                label="Edit destination"
                onClose={() => {
                    setOpenEdit(false)
                }}
                open={openEdit}>
                {openEdit && <DestinationForm
                    onSubmit={onEdit}
                    value={data}
                />}
            </FormDrawer>
        </TuiForm>}
    </>

}

DestinationDetails.propTypes = {
    id: PropTypes.string,
    onDelete: PropTypes.func,
    onEdit: PropTypes.func,
};

export default DestinationDetails;
