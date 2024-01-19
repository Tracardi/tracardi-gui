import React, {useEffect} from "react";
import Properties from "./DetailProperties";
import Button from "../forms/Button";
import Rows from "../misc/Rows";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import {useConfirm} from "material-ui-confirm";
import FormDrawer from "../drawers/FormDrawer";
import {VscTrash, VscEdit} from "react-icons/vsc";
import PropTypes from "prop-types";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupHeader} from "../tui/TuiForm";
import EventReshapingForm from "../forms/EventReshapingForm";
import {isEmptyObject} from "../../../misc/typeChecking";
import JsonBrowser from "../misc/JsonBrowser";
import NoData from "../misc/NoData";
import Tabs, {TabCase} from "../tabs/Tabs";
import EventTypeMetadata from "./EventTypeMetadata";
import Tag from "../misc/Tag";
import {RestrictToContext} from "../../context/RestrictContext";
import {useRequest} from "../../../remote_api/requestClient";

function Spanner({children}) {
    return <div style={{padding: 20}}>{children}</div>
}

export function EventReshapingCard({data, onDeleteComplete, onEditComplete, displayMetadata = true}) {

    const [displayEdit, setDisplayEdit] = React.useState(false);
    const [tab, setTab] = React.useState(0);

    const confirm = useConfirm();
    const {request} = useRequest()

    const onEditClick = () => {
        if (data) {
            setDisplayEdit(true);
        }
    }

    const handleEdit = (flowData) => {
        if (onEditComplete instanceof Function) onEditComplete(flowData);
        setDisplayEdit(false);
    }

    const onDelete = () => {
        confirm({
            title: "Do you want to delete this event reshaping schema?",
            description: "This action can not be undone."
        })
            .then(async () => {
                    try {
                        await request({
                            url: '/event-reshape-schema/' + data.id,
                            method: "delete"
                        })
                        if (onDeleteComplete) {
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
            {displayMetadata && <EventTypeMetadata data={data}/>}
            <TuiFormGroup>
                <TuiFormGroupHeader header="Trigger condition" description="Event reshaping is triggered only when."/>
                <TuiFormGroupContent>
                    <div style={{fontSize: 18}}><Tag backgroundColor="black" color="white">WHEN</Tag> event type is <Tag>{data?.event_type}</Tag></div>
                    {data?.reshaping?.condition && <div style={{fontSize: 18}}>
                    <Tag backgroundColor="black" color="white">AND</Tag>{data.reshaping.condition}
                </div>}
                </TuiFormGroupContent>
            </TuiFormGroup>
            <TuiFormGroup>
                <TuiFormGroupHeader header="Reshaping schema" description="How the event is changed."/>
                <Tabs tabs={["Event Properties", "Event Context", "Session Context"]} defaultTab={tab}
                      onTabSelect={setTab}>
                    <TabCase id={0}>
                        {!isEmptyObject(data?.reshaping?.reshape_schema?.properties)
                            ? <Spanner><JsonBrowser data={data.reshaping.reshape_schema.properties}
                                                    tree={false}/></Spanner>
                            : <NoData header="No schema defined"/>}
                    </TabCase>
                    <TabCase id={1}>
                        {!isEmptyObject(data?.reshaping?.reshape_schema?.context)
                            ?
                            <Spanner><JsonBrowser data={data.reshaping.reshape_schema.context} tree={false}/></Spanner>
                            : <NoData header="No schema defined"/>}
                    </TabCase>
                    <TabCase id={2}>
                        {!isEmptyObject(data?.reshaping?.reshape_schema?.session)
                            ?
                            <Spanner><JsonBrowser data={data.reshaping.reshape_schema.session} tree={false}/></Spanner>
                            : <NoData header="No schema defined"/>}
                    </TabCase>
                </Tabs>
            </TuiFormGroup>
        </TuiForm>
        <RestrictToContext>
            <div style={{marginBottom: 20}}>
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
            </div>
        </RestrictToContext>

    </>

    return <div className="Box10" style={{height: "100%"}}>
        {data && <Details/>}
        <FormDrawer
            width={800}
            onClose={() => {
                setDisplayEdit(false)
            }}
            open={displayEdit}>
            {displayEdit && <EventReshapingForm
                onSubmit={handleEdit}
                init={data}
            />}
        </FormDrawer>
    </div>
}

export default function EventReshapingDetails({id, onDeleteComplete}) {

    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(false);

    const {request} = useRequest()

    useEffect(() => {
            let isSubscribed = true;
            setLoading(true);

            request({
                url: '/event-reshape-schema/' + id,
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

    if (loading)
        return <CenteredCircularProgress/>

    return <EventReshapingCard data={data} onDeleteComplete={onDeleteComplete}
                               onEditComplete={(data) => setData(data)}/>
}

EventReshapingDetails.propTypes = {
    id: PropTypes.string,
    onDeleteComplete: PropTypes.func,
};