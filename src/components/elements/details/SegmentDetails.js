import React, {useEffect} from "react";
import Properties from "./DetailProperties";
import Button from "../forms/Button";
import Rows from "../misc/Rows";
import {request} from "../../../remote_api/uql_api_endpoint";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import {useConfirm} from "material-ui-confirm";
import FormDrawer from "../drawers/FormDrawer";
import SegmentForm from "../forms/SegmentForm";
import {VscTrash} from "@react-icons/all-files/vsc/VscTrash";
import {VscEdit} from "@react-icons/all-files/vsc/VscEdit";
import PropTypes from "prop-types";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";

export default function SegmentDetails({id, onDeleteComplete}) {

    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [displayEdit, setDisplayEdit] = React.useState(false);

    const confirm = useConfirm();

    useEffect(() => {
            setLoading(true);
            request({
                    url: '/segment/' + id,
                    method: "get"
                },
                setLoading,
                () => {
                },
                (result) => {
                    setData(result.data);
                }
            );
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
        confirm({title: "Do you want to delete this segment?", description: "This action can not be undone."})
            .then(() => {
                    request({
                            url: '/segment/' + id,
                            method: "delete"
                        },
                        () => {
                        },
                        () => {
                        },
                        (result) => {
                            if (result) {
                                request({
                                        url: '/segments/refresh'
                                    },
                                    ()=>{},
                                    ()=>{},
                                    ()=>{
                                        if (onDeleteComplete) {
                                            onDeleteComplete(data.id)
                                        }
                                    }
                                )
                            }
                        }
                    );

                }
            )
            .catch(() => {
            })
    }

    const Details = () => <TuiForm>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Segment" description="Information on segment."/>
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
            label="Edit Segment"
            onClose={() => {
                setDisplayEdit(false)
            }}
            open={displayEdit}>
            {displayEdit && <SegmentForm
                onSubmit={onEditComplete}
                init={data}
            />}
        </FormDrawer>
    </div>
}

SegmentDetails.propTypes = {
    id: PropTypes.string,
    onDeleteComplete: PropTypes.func,
  };