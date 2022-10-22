import PropertyField from "./PropertyField";
import DateValue from "../misc/DateValue";
import ProfileMergeTag from "../misc/ProfileMergeTag";
import React from "react";
import IdLabel from "../misc/IconLabels/IdLabel";
import ProfileLabel from "../misc/IconLabels/ProfileLabel";
import {profileName} from "../../../misc/formaters";

export default function ProfileCardInfo({profile}) {
    return <>
        <PropertyField name="Id" content={<IdLabel label={profile.id}/>}/>
        <PropertyField name="Profile" content={<ProfileLabel label={profileName(profile)}/>} />
        <PropertyField name="Created" content={<DateValue date={profile.metadata?.time?.insert}/>}/>
        <PropertyField name="Last visit" content={<DateValue date={profile?.metadata?.time?.visit?.current}/>}/>
        <PropertyField name="All visits" content={profile?.metadata?.time?.visit.count}/>
        <PropertyField name="Telephone" content={profile?.pii?.telephone}/>
        <PropertyField name="Active" content={<ProfileMergeTag profile={profile}/>} underline={false}/>
    </>
}