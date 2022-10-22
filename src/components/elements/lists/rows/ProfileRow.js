import PropertyField from "../../details/PropertyField";
import {profileName} from "../../../../misc/formaters";
import ProfileDetails from "../../details/ProfileDetails";
import {isEmptyObject} from "../../../../misc/typeChecking";
import JsonStringify from "../../misc/JsonStingify";
import React from "react";
import ProfileCardInfo from "../../details/ProfileCardInfo";

export default function ProfileRow({profile, filterFields}) {
    return <div style={{display: "flex"}}>
        <div style={{flex: "1 1 0", minWidth: 400, borderRight: "solid 1px #ccc", paddingRight: 17}}>
            <ProfileCardInfo profile={profile}/>
        </div>
        <div style={{flex: "3 1 0", width: "100%", paddingLeft: 15}}>
            <div style={{paddingRight: 15, marginBottom: 10}}>
                <PropertyField content={<span style={{fontSize: "110%", fontWeight: 500}}>{profileName(profile)}</span>} drawerSize={1200} underline={false}>
                    <ProfileDetails profile={profile}/>
                </PropertyField>
            </div>
            <fieldset style={{borderWidth: "1px 0 0 0", borderRadius: 0}}>
                <legend>Public traits</legend>
                {!isEmptyObject(profile.traits?.public) ?
                    <JsonStringify data={profile.traits} filterFields={filterFields}/> : "No traits"}
            </fieldset>
            {!isEmptyObject(profile.traits?.private) && <fieldset style={{borderWidth: "1px 0 0 0", borderRadius: 0}}>
                <legend>Private traits</legend>
                <JsonStringify data={profile.traits?.private} filterFields={filterFields}/>
            </fieldset>}
        </div>
    </div>
}