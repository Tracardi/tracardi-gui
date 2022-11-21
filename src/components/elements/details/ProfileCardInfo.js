import PropertyField from "./PropertyField";
import DateValue from "../misc/DateValue";
import ProfileMergeTag from "../misc/ProfileMergeTag";
import React from "react";
import IdLabel from "../misc/IconLabels/IdLabel";
import ProfileLabel from "../misc/IconLabels/ProfileLabel";
import {profileName} from "../../../misc/formaters";
import {BsGlobe} from "react-icons/bs";
import IconLabel from "../misc/IconLabels/IconLabel";

export default function ProfileCardInfo({profile}) {

    const labelWidth = 180

    return <>
        <PropertyField labelWith={labelWidth} name="Id" content={<IdLabel label={profile.id}/>}/>
        <PropertyField labelWith={labelWidth} name="Profile" content={<ProfileLabel label={profileName(profile)}/>}/>
        <PropertyField labelWith={labelWidth} name="First visit" content={<DateValue date={profile.metadata?.time?.insert}/>}/>
        <PropertyField labelWith={labelWidth} name="Last visit" content={<>
            <DateValue date={profile?.metadata?.time?.visit?.current}/>
            {profile?.metadata?.time?.visit?.tz && <IconLabel
                value={profile?.metadata.time.visit.tz}
                style={{marginLeft: 5}}
                icon={<BsGlobe size={20} style={{marginRight: 5}}/>}
            />}
        </>}/>
        <PropertyField labelWith={labelWidth} name="All visits" content={profile?.metadata?.time?.visit.count}/>
        <PropertyField labelWith={labelWidth} name="Telephone" content={profile?.pii?.telephone}/>
        <PropertyField labelWith={labelWidth} name={profile?.metadata?.merged_with ? "Merged with" : "Active"}
                       content={<ProfileMergeTag profile={profile}/>} underline={false}/>
    </>
}