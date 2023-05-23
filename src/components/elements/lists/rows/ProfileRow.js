import {isEmptyObject, isNotEmptyArray} from "../../../../misc/typeChecking";
import JsonStringify from "../../misc/JsonStingify";
import React from "react";
import ProfileCardInfo from "../../details/ProfileCardInfo";
import TuiTags from "../../tui/TuiTags";

export default function ProfileRow({profile, filterFields}) {


    return <>
        <div style={{display: "flex"}}>
            <div style={{flex: "1 1 0", minWidth:760, borderRight: "solid 1px #ccc", paddingRight: 17}}>
                <ProfileCardInfo profile={profile}/>
            </div>
            <div style={{
                flex: "2 1 0",
                width: "100%",
                paddingLeft: 15,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
            }}>

                {!isEmptyObject(profile.data?.pii) &&
                <fieldset style={{borderWidth: "1px 0 0 0", borderRadius: 0}}>
                    <legend>PII</legend>
                    <JsonStringify data={profile.data?.pii} disableEmpty={true}/>
                </fieldset>}
                {!isEmptyObject(profile.traits) && <fieldset style={{borderWidth: "1px 0 0 0", borderRadius: 0}}>
                    <legend>Custom Traits</legend>
                    {!isEmptyObject(profile.traits ?
                        <JsonStringify data={profile.traits} filterFields={filterFields}/> : "No traits")}
                </fieldset>}
                {isNotEmptyArray(profile.segments) &&
                <fieldset style={{borderWidth: "1px 0 0 0", borderRadius: 0, marginTop: 10}}>
                    <legend>Segments</legend>
                    <div className="flexLine" style={{gap: 5}}><TuiTags tags={profile.segments} size="small"/></div>
                </fieldset>}
                {!isEmptyObject(profile.data?.contact) &&
                <fieldset style={{borderWidth: "1px 0 0 0", borderRadius: 0}}>
                    <legend>Contact Data</legend>
                    <JsonStringify data={profile.data?.contact} disableEmpty={true}/>
                </fieldset>}
            </div>
        </div>
    </>
}