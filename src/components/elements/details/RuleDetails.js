import React, {useEffect} from "react";
import "./Details.css";
import "./RuleDetails.css";
import Button from "../forms/Button";
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
import TuiTags from "../tui/TuiTags";
import ActiveTag from "../misc/ActiveTag";
import Tag from "../misc/Tag";
import NoData from "../misc/NoData";
import {isNotEmptyArray} from "../../../misc/typeChecking";

function ConsentsTags({data}) {
    const tags = Array.isArray(data?.properties?.consents)
        ? data?.properties?.consents.map(item => item.name)
        : []
    return tags.map(consent => <Tag key={consent}>{consent}</Tag>)
}

export function RuleCard({data, onDeleteComplete, onEditComplete, displayMetadata = true}) {

    const [deleteProgress, setDeleteProgress] = React.useState(false);
    const [openEdit, setOpenEdit] = React.useState(false);

    const confirm = useConfirm()

    const handleEdit = () => {
        setOpenEdit(true)
    }

    const handleEditComplete = (flowData) => {
        setOpenEdit(false);
        if (onEditComplete instanceof Function) onEditComplete(flowData);
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
    if (!data) {
        return <NoData header="No routing data"/>
    }

    return <>
        <TuiForm style={{margin: 20}}>
            {displayMetadata && <TuiFormGroup>
                <TuiFormGroupContent style={{borderRadius: "inherit"}}>
                    <TuiFormGroupContent>
                        <PropertyField name="Id" content={<IdLabel label={data?.id}/>}/>
                        <PropertyField name="Trigger type" content={data?.type}/>
                        <PropertyField name="Name" content={data?.name}/>
                        <PropertyField name="Description" content={data?.description} whiteSpace="normal"/>
                        <PropertyField name="Created" content={<DateValue date={data?.metadata?.time?.insert}/>}/>
                        {/*<PropertyField name="Required consents" content={data?.properties?.consents}/>*/}
                        <PropertyField name="Tags" content={<TuiTags tags={data?.tags} size="small"/>}/>
                        <PropertyField name="Active" content={<ActiveTag active={data?.enabled}/>}/>

                    </TuiFormGroupContent>
                </TuiFormGroupContent>
            </TuiFormGroup>}
            <TuiFormGroup>
                <TuiFormGroupHeader header="Trigger" description="Workflow will trigger only if this rule is met."/>
                {data?.type === 'event-collect' && <TuiFormGroupContent>
                    <div style={{fontSize: 18, marginBottom: 5}}><Tag backgroundColor="black" color="white">IF</Tag>event
                        type is <Tag>{data?.event_type?.name}</Tag></div>
                    <div style={{fontSize: 18, marginBottom: 5}}><Tag backgroundColor="black"
                                                                      color="white">AND</Tag> event
                        comes from source <Tag>{data?.source?.name}</Tag></div>
                    {isNotEmptyArray(data?.properties?.consents) && <div style={{fontSize: 18, marginBottom: 5}}>
                        <Tag backgroundColor="black"
                             color="white">AND</Tag> profile granted the following
                        consents <ConsentsTags data={data}/></div>}
                    <div style={{fontSize: 18, marginBottom: 5}}><Tag backgroundColor="black" color="white">THEN</Tag>
                        workflow <Tag>{data?.flow?.name}</Tag> will be triggered</div>
                </TuiFormGroupContent>}
                {data?.type === 'segment-add' && <TuiFormGroupContent>
                    <div style={{fontSize: 18, marginBottom: 5}}><Tag backgroundColor="black" color="white">IF</Tag>
                        segment <Tag>{data?.segment?.name}</Tag> is added to a profile</div>
                    <div style={{fontSize: 18, marginBottom: 5}}><Tag backgroundColor="black" color="white">THEN</Tag>
                        workflow <Tag>{data?.flow?.name}</Tag> will be triggered</div>
                </TuiFormGroupContent>}

            </TuiFormGroup>
            <div>
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
            </div>
        </TuiForm>

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
    </>

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

