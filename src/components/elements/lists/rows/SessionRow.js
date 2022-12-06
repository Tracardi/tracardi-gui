import PropertyField from "../../details/PropertyField";
import {isEmptyObject} from "../../../../misc/typeChecking";
import JsonStringify from "../../misc/JsonStingify";
import React from "react";
import SessionDetails from "../../details/SessionDetails";
import SessionCardInfo from "../../details/SessionCardInfo";

export default function SessionRow({session, filterFields}) {

    const displayContext = window?.CONFIG?.session?.display?.row?.context

    return <div style={{display: "flex"}}>
        <div style={{flex: "1 1 0", minWidth: 540, borderRight: "solid 1px #ccc", paddingRight: 17}}>
            <SessionCardInfo session={session}/>
        </div>
        <div style={{flex: "2 1 0", width: "100%", paddingLeft: 15}}>
            <div style={{paddingRight: 15, marginBottom: 10}}>
                <PropertyField content={<span style={{fontSize: "110%", fontWeight: 500}}>{session.id}</span>}
                               drawerSize={1300} underline={false}>
                    <SessionDetails data={session}/>
                </PropertyField>
            </div>
            {displayContext && <fieldset style={{borderWidth: "1px 0 0 0", borderRadius: 0}}>
                <legend>Context</legend>
                {!isEmptyObject(session.context) ?
                    <JsonStringify data={session.context} filterFields={filterFields}/> : "No context"}
            </fieldset>}
        </div>
    </div>
}