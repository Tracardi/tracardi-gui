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
import ResponsiveDialog from "../../dialog/ResponsiveDialog";
import Button from "../../forms/Button";
import {BsGlobe, BsXCircle} from "react-icons/bs";
import {ObjectInspector} from "react-inspector";
import theme from "../../../../themes/inspector_light_theme";
import {VscJson} from "react-icons/vsc";
import {SessionDetailsById} from "../../details/SessionDetails";
import IconLabel from "../../misc/IconLabels/IconLabel";

export function EventRow({row, filterFields}) {

    const [jsonData, setJsonData] = useState(null);

    const handleJsonClick = (data) => {
        setJsonData(data)
    }

    const labelWidth = 180
    const displaySession = window?.CONFIG?.event?.display?.row?.session
    const displaySource = window?.CONFIG?.event?.display?.row?.source
    const displayChannel = window?.CONFIG?.event?.display?.row?.channel
    const displayCreateTime = window?.CONFIG?.event?.display?.row?.createTime

    return <>
        {jsonData && <ResponsiveDialog title="Event JSON"
                                       open={jsonData !== null}
                                       button={<Button label="Close"
                                                       icon={<BsXCircle size={20}/>}
                                                       onClick={() => setJsonData(null)}/>}>
            <ObjectInspector data={jsonData} theme={theme} expandLevel={5}/>
        </ResponsiveDialog>}
        <div style={{display: "flex"}}>
            <div style={{flex: "1 1 0", minWidth: 560, borderRight: "solid 1px #ccc", paddingRight: 17}}>
                <PropertyField labelWidth={labelWidth} name="id" content={<IdLabel label={row?.id}/>}/>
                {displayCreateTime && row?.metadata?.time?.create && <PropertyField labelWidth={labelWidth} name="Created" content={<>
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
                {displayChannel && row?.metadata?.channel && <PropertyField labelWidth={labelWidth} name="Channel" content={row?.metadata.channel}/>}
                <PropertyField labelWidth={labelWidth}
                               name={window?.CONFIG?.profile?.id || "Profile id"}
                               content={<ProfileLabel label={row?.profile?.id}
                                                      profileIcon={window?.CONFIG?.profile?.icon1 || "profile"}
                                                      profileLessIcon={window?.CONFIG?.profile?.icon2 || "profile-less"}
                                                      profileLess={row?.profile === null}/>}
                               drawerSize={1320}>
                    {row?.profile?.id && <ProfileDetailsById id={row?.profile?.id}/>}
                </PropertyField>
                {row?.profile?.metadata?.time?.visit?.count && <PropertyField labelWidth={labelWidth}
                               name="Profile visits"
                               content={row?.profile?.metadata?.time?.visit?.count}/>}
                {displaySource && <PropertyField labelWidth={labelWidth}
                               name="Source id"
                               content={<IdLabel label={row?.source?.id}/>}>
                    <EventSourceDetails id={row?.source?.id}/>
                </PropertyField>}
                {displaySession && row?.session?.id && <PropertyField labelWidth={labelWidth}
                                                   name="Session id"
                                                   content={<IdLabel label={row?.session?.id}/>}
                                                   drawerSize={1320}
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
                                           <EventTypeTag eventType={row?.type} profile={row?.profile?.id}/>
                                           <EventStatusTag label={row?.metadata?.status}/>
                                           <EventValidation eventMetaData={row?.metadata}/>
                                           <EventWarnings eventMetaData={row?.metadata}/>
                                           <EventErrorTag eventMetaData={row?.metadata}/>
                                       </div>}>
                            <EventDetailsById id={row?.id}/>
                        </PropertyField>
                    </div>

                    <fieldset style={{borderWidth: "1px 0 0 0", borderRadius: 0}}>
                        <legend>Properties</legend>
                        {!isEmptyObject(row?.properties) ?
                            <JsonStringify data={row?.properties} filterFields={filterFields}/> : "No properties"}
                    </fieldset>

                    {!isEmptyObject(row?.traits) && <fieldset style={{borderWidth: "1px 0 0 0", borderRadius: 0}}>
                        <legend>Traits</legend>
                        <JsonStringify data={row?.traits} filterFields={filterFields}/></fieldset>}
                </div>
                <div>
                    <Button label="Json" size="small" icon={<VscJson size={20}/>} onClick={() => handleJsonClick(row)}/>
                </div>
            </div>

        </div>
    </>
}