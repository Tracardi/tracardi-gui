import PropertyField from "../../details/PropertyField";
import {isEmptyObject} from "../../../../misc/typeChecking";
import JsonStringify from "../../misc/JsonStingify";
import React from "react";
import DateValue from "../../misc/DateValue";
import {BsGlobe, BsClock} from "react-icons/bs";
import SessionDetails from "../../details/SessionDetails";

export default function SessionRow({session, filterFields}) {
    return <div style={{display: "flex"}}>
        <div style={{flex: "1 1 0", minWidth: 400, borderRight: "solid 1px #ccc", paddingRight: 17}}>
            <PropertyField name="Created" content={<DateValue date={session.metadata?.time?.insert}/>}/>
            {session?.context?.time?.tz && <PropertyField
                name="Created"
                content={<><BsGlobe size={20} style={{marginRight: 5}}/> {session.context.time.tz}</>}
            />}
            {session?.metadata?.time?.duration && <PropertyField
                name="Duration"
                content={<><BsClock size={20} style={{marginRight: 5}}/> {Math.floor(session.metadata.time.duration/60)}m</>}
            />}
            {session?.context?.browser?.local?.device?.platform && <PropertyField
                name="Platform"
                content={session.context.browser.local.device.platform}
            />}
            {session?.context?.browser?.local?.browser?.name && <PropertyField
                name="Browser"
                content={session.context.browser.local.browser.name}
            />}

            <PropertyField name="Profile id" content={session?.profile?.id}/>
        </div>
        <div style={{flex: "3 1 0", width: "100%", paddingLeft: 15}}>
            <div style={{paddingRight: 15, marginBottom: 10}}>
                <PropertyField content={session.id} drawerSize={1000} underline={false}>
                    <SessionDetails data={session}/>
                </PropertyField>
            </div>
            <fieldset style={{borderWidth: "1px 0 0 0", borderRadius: 0}}>
                <legend>Context</legend>
                {!isEmptyObject(session.context) ?
                    <JsonStringify data={session.context} filterFields={filterFields}/> : "No context"}
            </fieldset>
        </div>
    </div>
}