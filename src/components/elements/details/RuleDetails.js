import React, {useEffect, useRef} from "react";
import "./Details.css";
import "./RuleDetails.css";
import Button from "../forms/Button";
import UqlDetails from "./UqlDetails";
import Rows from "../misc/Rows";
import {VscTrash, VscEdit} from "react-icons/vsc";
import PropTypes from "prop-types";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupHeader} from "../tui/TuiForm";
import {asyncRemote} from "../../../remote_api/entrypoint";
import {useConfirm} from "material-ui-confirm";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import FormDrawer from "../drawers/FormDrawer";
import RuleForm from "../forms/RuleForm";
import PropertyField from "./PropertyField";
import DateValue from "../misc/DateValue";
import IdLabel from "../misc/IconLabels/IdLabel";
import IconLabel from "../misc/IconLabels/IconLabel";
import FlowNodeIcons from "../../flow/FlowNodeIcons";
import TuiTags from "../tui/TuiTags";
import ActiveTag from "../misc/ActiveTag";
import EventSourceDetails from "./EventSourceDetails";

export function RuleCard({data, onDeleteComplete, onEditComplete, displayMetadata=true}) {

    const [deleteProgress, setDeleteProgress] = React.useState(false);
    const [openEdit, setOpenEdit] = React.useState(false);

    const confirm = useConfirm()

    const handleEdit = () => {
        setOpenEdit(true)
    }

    const handleEditComplete = (flowData) => {
        setOpenEdit(false);
        if(onEditComplete instanceof Function) onEditComplete(flowData);
    }

    const handleDelete = () => {
        confirm({title: "Do you want to delete this rule?", description: "This action can not be undone."})
            .then(async () => {
                    setDeleteProgress(true);
                    await asyncRemote({
                        url: '/rule/' + data?.id,
                        method: "delete"
                    })
                    if (onDeleteComplete) {
                        onDeleteComplete(data?.id)
                    }
                }
            )
            .catch(
                () => {
                }
            ).finally(() => {
                setDeleteProgress(false);
            }
        )
    }

    return <TuiForm style={{margin: 20}}>
            <TuiFormGroup>
                <TuiFormGroupHeader header={data?.name} description="Routing rule properties"/>
                <TuiFormGroupContent>
                    <TuiFormGroupContent>
                        {data &&
                        <>
                            <PropertyField name="Id" content={<IdLabel label={data?.id} />}/>
                            <PropertyField name="Name" content={data?.name}/>
                            <PropertyField name="Description" content={data?.description} whiteSpace="normal"/>
                            <PropertyField name="Created" content={<DateValue date={data?.metadata?.time?.insert} />}/>
                            <PropertyField name="Source" content={data?.source?.name} drawerSize={750}>
                                <EventSourceDetails id={data?.source?.id}/>
                            </PropertyField>
                            <PropertyField name="Event type" content={<IconLabel value={data?.event?.type} icon={<FlowNodeIcons icon="event"/>}/>}/>
                            <PropertyField name="Flow" content={<IconLabel value={data?.flow?.name} icon={<FlowNodeIcons icon="flow"/>}/>}/>
                            <PropertyField name="Properties" content={data?.properties}/>
                            <PropertyField name="Tags" content={<TuiTags tags={data?.tags} size="small"/>}/>
                            <PropertyField name="Active" content={<ActiveTag active={data?.enabled}/>}/>
                            <PropertyField name="Rule" content={<UqlDetails data={data} type="Rule"/>}/>
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
                        </>
                        }

                    </TuiFormGroupContent>
                </TuiFormGroupContent>
            </TuiFormGroup>
            <FormDrawer
                width={700}
                onClose={() => {
                    setOpenEdit(false)
                }}
                open={openEdit}>
                {openEdit && <RuleForm
                    onSubmit={handleEditComplete}
                    data={data}
                />}
            </FormDrawer>
        </TuiForm>

}


export default function RuleDetails({id, onDeleteComplete, onEditComplete}) {

    const [loading, setLoading] = React.useState(false);
    const [data, setData] = React.useState(null);

    useEffect(() => {
        let isSubscribed = true
        setLoading(true);
        asyncRemote({
                url: '/rule/' + id,
                method: "get"
            }
        ).then((response) => {
            if (response?.data && isSubscribed) {
                setData(response?.data)
            }
        }).catch((e) => {
            if (e && isSubscribed) {

            }
        }).finally(
            () => {
                if (isSubscribed) {
                    setLoading(false)
                }
            }
        )
        return () => {
            isSubscribed = false;
        };
    }, [id])

    if (loading) return <CenteredCircularProgress/>

    return <RuleCard data={data} onEditComplete={onEditComplete} onDeleteComplete={onDeleteComplete}/>

}

RuleDetails.propTypes = {
    id: PropTypes.string,
    onDeleteComplete: PropTypes.func,
    onEditComplete: PropTypes.func,
};

