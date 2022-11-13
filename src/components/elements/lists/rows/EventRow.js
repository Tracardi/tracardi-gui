import PropertyField from "../../details/PropertyField";
import EventDetails from "../../details/EventDetails";
import {profileName} from "../../../../misc/formaters";
import ProfileDetails from "../../details/ProfileDetails";
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
import {BsXCircle} from "react-icons/bs";
import {ObjectInspector} from "react-inspector";
import theme from "../../../../themes/inspector_light_theme";
import {VscJson} from "react-icons/vsc";
import {SessionDetailsById} from "../../details/SessionDetails";

export function EventRow({row, filterFields}) {

    const [jsonData, setJsonData] = useState(null);

    const handleJsonClick = (data) => {
        setJsonData(data)
    }

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
                <PropertyField name="id" content={<IdLabel label={row.id}/>}/>
                <PropertyField name="Created" content={<DateValue date={row.metadata?.time?.insert}/>}/>
                <PropertyField name="Profile" content={<ProfileLabel label={profileName(row.profile)}
                                                                     profileLess={row.profile === null}/>}
                               drawerSize={1320}>
                    {row.profile && <ProfileDetails profile={row.profile}/>}
                </PropertyField>
                <PropertyField name="Profile visits" content={row.profile?.metadata?.time?.visit?.count}/>
                <PropertyField name="Source id" content={<IdLabel label={row.source?.id}/>}>
                    <EventSourceDetails id={row.source?.id}/>
                </PropertyField>
                {row.session?.id && <PropertyField name="Session id"
                                                   content={<IdLabel label={row.session?.id}/>}
                                                   drawerSize={1320}
                >
                    <SessionDetailsById id={row.session?.id}/>
                </PropertyField>}
                {isNotEmptyArray(row.metadata?.processed_by?.rules) && <PropertyField name="Routed by" content={<TuiTags
                    tags={row.metadata?.processed_by?.rules} size="small"/>}/>}
                <PropertyField name="Process time" content={row.metadata?.time?.process_time} underline={false}/>
                {isNotEmptyArray(row.tags?.values) && <PropertyField name="Tags" content={<TuiTags
                    tags={row.tags?.values} size="small"/>}/>}
            </div>
            <div style={{flex: "2 1 0", paddingLeft: 15, display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                <div>
                    <div style={{paddingRight: 15, marginBottom: 10}}>
                        <PropertyField underline={false}
                                       drawerSize={1000}
                                       content={<div style={{display: "flex", gap: 5, alignItems: "center"}}>
                                           <EventTypeTag eventType={row.type} profile={row?.profile?.id}/>
                                           <EventStatusTag label={row.metadata.status}/>
                                           <EventValidation eventMetaData={row.metadata}/>
                                           <EventWarnings eventMetaData={row.metadata}/>
                                           <EventErrorTag eventMetaData={row.metadata}/>
                                       </div>}>
                            <EventDetails event={row}/>
                        </PropertyField>
                    </div>

                    <fieldset style={{borderWidth: "1px 0 0 0", borderRadius: 0}}>
                        <legend>Properties</legend>
                        {!isEmptyObject(row.properties) ?
                            <JsonStringify data={row.properties} filterFields={filterFields}/> : "No properties"}
                    </fieldset>
                </div>
                <div>
                    <Button label="Json" size="small" icon={<VscJson size={20}/>} onClick={() => handleJsonClick(row)}/>
                </div>
            </div>

        </div>
    </>
}