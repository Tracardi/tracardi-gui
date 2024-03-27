import PropertyField from "../../details/PropertyField";
import {EventDetailsById} from "../../details/EventDetails";
import {ProfileDetailsById} from "../../details/ProfileDetails";
import {isEmptyObject, isNotEmptyArray} from "../../../../misc/typeChecking";
import JsonStringify from "../../misc/JsonStingify";
import React, {useState} from "react";
import DateValue from "../../misc/DateValue";
import EventTypeTag from "../../misc/EventTypeTag";
import EventStatusTag from "../../misc/EventStatusTag";
import EventValidation from "../../misc/EventValidation";
import EventWarnings from "../../misc/EventWarnings";
import EventErrorTag from "../../misc/EventErrorTag";
import TuiTags from "../../tui/TuiTags";
import IdLabel from "../../misc/IconLabels/IdLabel";
import ProfileLabel from "../../misc/IconLabels/ProfileLabel";
import EventSourceDetails from "../../details/EventSourceDetails";
import Button from "../../forms/Button";
import {BsGlobe} from "react-icons/bs";
import {VscDebug, VscJson} from "react-icons/vsc";
import {SessionDetailsById} from "../../details/SessionDetails";
import IconLabel from "../../misc/IconLabels/IconLabel";
import {displayLocation} from "../../../../misc/location";
import OsIcon from "../../misc/IconLabels/OsLabel";
import DataTreeDialog from "../../dialog/DataTreeDialog";
import {EventTypeFlowsAC} from "../../forms/inputs/EventTypeFlowsAC";
import ModalDialog from "../../dialog/ModalDialog";
import {TuiForm, TuiFormGroupField} from "../../tui/TuiForm";
import {useNavigate} from "react-router-dom";
import urlPrefix from "../../../../misc/UrlPrefix";
import EventJourneyTag from "../../misc/EventJourneyTag";
import MergingAlert from "../../misc/MergingAlert";
import EventAsyncTag from "../../misc/EventAsyncTag";

export function EventRow({row, filterFields}) {

    const [jsonData, setJsonData] = useState(null);
    const [debugModalWindow, setDebugModalWindow] = useState(false);

    const navigate = useNavigate();

    const handleDebugSelect = (value) => {
        if (value) {
            navigate(urlPrefix(`/flow/collection/edit/${value.flow.id}/${row.id}`))
        }
    }

    const handleJsonClick = (data) => {
        setJsonData(data)
    }

    const handleDebugClick = (open) => {
        setDebugModalWindow(open)
    }

    const labelWidth = 180
    const displaySession = window?.CONFIG?.event?.display?.row?.session
    const displaySource = window?.CONFIG?.event?.display?.row?.source
    const displayChannel = window?.CONFIG?.event?.display?.row?.channel
    const displayCreateTime = window?.CONFIG?.event?.display?.row?.createTime

    return <>
        {jsonData && <DataTreeDialog open={jsonData !== null}
                                     data={jsonData}
                                     onClose={() => setJsonData(null)}/>}
        {debugModalWindow && <ModalDialog
            fullWidth={false}
            maxWidth="xs"
            open={debugModalWindow}
            onClose={() => setDebugModalWindow(false)}>
            <TuiForm style={{padding: 20}}>
                <TuiFormGroupField header="Select workflow to debug"
                                   description="Please find all workflows that are bound to this event via
                                           routing. Select workflow that you would like to debug and click debug
                                           button in workflow editor.">
                    <EventTypeFlowsAC eventType={row.type}
                                      onSelect={handleDebugSelect}
                                      fullWidth={true}
                    />
                </TuiFormGroupField>
            </TuiForm>

        </ModalDialog>}
        <div style={{display: "flex"}}>
            <div style={{flex: "1 1 0", minWidth: 560, borderRight: "solid 1px rgba(128,128,128, 0.5)", paddingRight: 17}}>
                <PropertyField labelWidth={labelWidth} name="id" content={<IdLabel label={row?.id}/>}/>
                {displayCreateTime && row?.metadata?.time?.create &&
                <PropertyField labelWidth={labelWidth} name="Created" content={<>
                    <DateValue date={row?.metadata?.time?.create} style={{marginRight: 5}}/>
                    {row?.session?.tz && <IconLabel
                        value={row?.session?.tz}
                        icon={<BsGlobe size={20} style={{marginRight: 5}}/>}
                    />}
                </>}/>}
                <PropertyField labelWidth={labelWidth} name="Inserted" content={<>
                    <DateValue date={row?.metadata?.time?.insert} style={{marginRight: 5}}/>
                    {row?.session?.tz && <IconLabel
                        value={row?.session?.tz}
                        icon={<BsGlobe size={20} style={{marginRight: 5}}/>}
                    />}
                </>}/>
                {row?.device?.geo?.country?.name && <PropertyField labelWidth={labelWidth} name="Location" content={
                    <IconLabel
                        value={<span title={row?.device?.ip} style={{cursor: "help"}}>{displayLocation(row?.device?.geo)}</span>}
                        icon={<BsGlobe size={20} style={{marginRight: 5}}/>}
                    />}/>}
                {row?.os?.name && <PropertyField
                    labelWidth={labelWidth}
                    name="Device"
                    content={<OsIcon platform={row.os.name}
                                     device={row?.device?.type}
                                     resolution={row?.device?.resolution}/>}
                />}
                {displayChannel && row?.metadata?.channel &&
                <PropertyField labelWidth={labelWidth} name="Channel" content={row?.metadata.channel}/>}
                <PropertyField labelWidth={labelWidth}
                               name={window?.CONFIG?.profile?.id || "Profile id"}
                               content={<ProfileLabel label={row?.profile?.id}
                                                      profileIcon={window?.CONFIG?.profile?.icon1 || "profile"}
                                                      profileLessIcon={window?.CONFIG?.profile?.icon2 || "profile-less"}
                                                      profileLess={row?.profile === null}/>}
                               drawerSize={1200}>
                    {row?.profile?.id && <ProfileDetailsById id={row?.profile?.id}/>}
                </PropertyField>
                {row?.profile?.metadata?.time?.visit?.count && <PropertyField labelWidth={labelWidth}
                                                                              name="Profile visits"
                                                                              content={row?.profile?.metadata?.time?.visit?.count}/>}
                {displaySource && <PropertyField labelWidth={labelWidth}
                                                 name="Source id"
                                                 content={<IdLabel label={row?.source?.id}/>}
                detailsRoles={['admin', 'maintainer', 'developer']}
                >
                    <EventSourceDetails id={row?.source?.id}/>
                </PropertyField>}
                {displaySession && row?.session?.id && <PropertyField labelWidth={labelWidth}
                                                                      name="Session id"
                                                                      content={<IdLabel label={row?.session?.id}/>}
                                                                      drawerSize={1200}
                >
                    <SessionDetailsById id={row?.session?.id}/>
                </PropertyField>}
                {isNotEmptyArray(row?.metadata?.processed_by?.rules) && <PropertyField
                    labelWidth={labelWidth}
                    name="Routed by"
                    content={<TuiTags
                        tags={row?.metadata?.processed_by?.rules}
                        size="small"/>}/>}
                {isNotEmptyArray(row?.tags?.values) && <PropertyField
                    labelWidth={labelWidth}
                    name="Tags" content={<TuiTags
                    tags={row?.tags?.values} size="small"/>}/>}
            </div>
            <div style={{
                flex: "2 1 0",
                paddingLeft: 15,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
            }}>
                <div>
                    <div style={{paddingRight: 15, marginBottom: 10}}>
                        <PropertyField underline={false}
                                       drawerSize={1000}
                                       content={<div style={{display: "flex", gap: 5, alignItems: "center"}}>
                                           <EventTypeTag event={row} />
                                           <EventStatusTag label={row?.metadata?.status}/>
                                           <EventValidation eventMetaData={row?.metadata}/>
                                           <MergingAlert eventMetaData={row?.metadata}/>
                                           <EventWarnings eventMetaData={row?.metadata}/>
                                           <EventErrorTag eventMetaData={row?.metadata}/>
                                           <EventAsyncTag event={row} />
                                           {row.journey?.state && <EventJourneyTag>{row.journey.state}</EventJourneyTag>}
                                           {row?.hit?.name &&
                                           <span title={row?.hit?.url} style={{cursor: "help"}}>{row?.hit?.name}</span>}
                                       </div>}>
                            <EventDetailsById id={row?.id}/>
                        </PropertyField>
                    </div>

                    {!isEmptyObject(row?.properties) && <fieldset style={{borderWidth: "1px 0 0 0", borderRadius: 0}}>
                        <legend>Properties</legend>
                        <JsonStringify data={{properties: row?.properties}}
                                       filterFields={filterFields}/>
                    </fieldset>}
                    {!isEmptyObject(row?.data) && <fieldset style={{borderWidth: "1px 0 0 0", borderRadius: 0}}>
                        <legend>Indexed Data</legend>
                        <JsonStringify data={{data: row?.data}}/></fieldset>}

                    {!isEmptyObject(row?.traits) && <fieldset style={{borderWidth: "1px 0 0 0", borderRadius: 0}}>
                        <legend>Indexed Custom Traits</legend>
                        <JsonStringify data={{traits: row?.traits}} filterFields={filterFields}/></fieldset>}
                </div>
                <div style={{display: "flex"}}>
                    <Button label="Json" size="small" icon={<VscJson size={20}/>} onClick={() => handleJsonClick(row)}/>
                    <Button label="Debug" size="small" icon={<VscDebug size={20}/>}
                            onClick={() => handleDebugClick(true)}/>

                </div>
            </div>

        </div>
    </>
}