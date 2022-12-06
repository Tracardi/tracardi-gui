import PropertyField from "./PropertyField";
import DateValue from "../misc/DateValue";
import ProfileMergeTag from "../misc/ProfileMergeTag";
import React from "react";
import IdLabel from "../misc/IconLabels/IdLabel";
import ProfileLabel from "../misc/IconLabels/ProfileLabel";
import {profileName} from "../../../misc/formaters";
import {BsGlobe, BsPhone} from "react-icons/bs";
import IconLabel from "../misc/IconLabels/IconLabel";
import {ProfileDetailsById} from "./ProfileDetails";
import FlowNodeIcons from "../../flow/FlowNodeIcons";

export default function ProfileCardInfo({profile}) {

    const labelWidth = 180

    return <>
        <PropertyField labelWidth={labelWidth} name="Id" content={<IdLabel label={profile.id}/>}/>
        {window?.CONFIG?.profile?.display?.row?.id === "name" && <PropertyField labelWidth={labelWidth} name={window?.CONFIG?.profile?.name || "Profile"} content={<ProfileLabel
            profileIcon={window?.CONFIG?.profile?.icon1 || "profile"}
            label={profileName(profile)}/>}
        />}
        {window?.CONFIG?.profile?.display?.row?.id === "id" && <PropertyField labelWidth={labelWidth} name={window?.CONFIG?.profile?.id || "Profile id"} content={<IconLabel
            icon={<span style={{marginRight: 5}}><FlowNodeIcons icon={window?.CONFIG?.profile?.icon1 || "profile"} size={20}/></span>}
            value={profile.id}/>}
        />}
        <PropertyField labelWidth={labelWidth} name="First seen" content={<DateValue date={profile.metadata?.time?.insert}/>}/>
        <PropertyField labelWidth={labelWidth} name="Last seen" content={<>
            <DateValue date={profile?.metadata?.time?.visit?.current}/>
            {profile?.metadata?.time?.visit?.tz && <IconLabel
                value={profile?.metadata.time.visit.tz}
                style={{marginLeft: 5}}
                icon={<BsGlobe size={20} style={{marginRight: 5}}/>}
            />}
        </>}/>
        <PropertyField labelWidth={labelWidth} name="All visits" content={profile?.metadata?.time?.visit.count}/>
        {profile?.pii?.telephone && <PropertyField labelWidth={labelWidth} name="Telephone" content={<IconLabel value={profile.pii.telephone} icon={<BsPhone size={20}/>}/>}/>}
        <PropertyField labelWidth={labelWidth} name={profile?.metadata?.merged_with ? "Merged with" : "Active"}
                       content={<ProfileMergeTag profile={profile}/>} underline={false} drawerSize={1300}>
            {profile?.metadata?.merged_with && <ProfileDetailsById id={profile.metadata.merged_with} />}
        </PropertyField>
    </>
}