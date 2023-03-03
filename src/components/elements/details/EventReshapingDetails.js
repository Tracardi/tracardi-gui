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
import EventReshapingForm from "../forms/EventReshapingForm";
import {isEmptyObject} from "../../../misc/typeChecking";
import JsonBrowser from "../misc/JsonBrowser";
import NoData from "../misc/NoData";
import Tabs, {TabCase} from "../tabs/Tabs";
import EventTypeMetadata from "./EventTypeMetadata";

function Spanner({children}) {
    return <div style={{padding: 20}}>{children}</div>
}

export function EventReshapingCard({data, onDeleteComplete, onEditComplete, displayMetadata = true}) {

    const [displayEdit, setDisplayEdit] = React.useState(false);
    const [tab, setTab] = React.useState(0);

    const confirm = useConfirm();

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
                        await asyncRemote({
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
            {data?.reshaping?.condition && <TuiFormGroup>
                <TuiFormGroupHeader header="Trigger condition" description="Event reshaping is triggered only when."/>
                <TuiFormGroupContent>
                <span style={{fontSize: 24}}>
                    {data.reshaping.condition}
                </span>
                </TuiFormGroupContent>
            </TuiFormGroup>}
            <TuiFormGroup>
                <TuiFormGroupHeader header="Reshaping schema" description="How the event is changed."/>
                <Tabs tabs={["Event Properties", "Event Context", "Session Context"]} defaultTab={tab}
                      onTabSelect={setTab}>
                    <TabCase id={0}>
                        {!isEmptyObject(data?.reshaping?.reshape_schema?.properties)
                            ? <Spanner><JsonBrowser data={data.reshaping.reshape_schema.properties}/></Spanner>
                            : <NoData header="No schema defined"/>}
                    </TabCase>
                    <TabCase id={1}>
                        {!isEmptyObject(data?.reshaping?.reshape_schema?.context)
                            ? <Spanner><JsonBrowser data={data.reshaping.reshape_schema.context}/></Spanner>
                            : <NoData header="No schema defined"/>}
                    </TabCase>
                    <TabCase id={2}>
                        {!isEmptyObject(data?.reshaping?.reshape_schema?.session)
                            ? <Spanner><JsonBrowser data={data.reshaping.reshape_schema.session}/></Spanner>
                            : <NoData header="No schema defined"/>}
                    </TabCase>
                </Tabs>
            </TuiFormGroup>

            <TuiFormGroup>
                <TuiFormGroupHeader header="Value mappings" description="How the event type, profile, and session values are mapped."/>
                <TuiFormGroupContent>
                    <TuiFormGroupField>
                        <Properties properties={data.reshaping.mapping}/>
                    </TuiFormGroupField>
                </TuiFormGroupContent>
            </TuiFormGroup>
        </TuiForm>
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


    useEffect(() => {
            let isSubscribed = true;
            setLoading(true);

            asyncRemote({
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