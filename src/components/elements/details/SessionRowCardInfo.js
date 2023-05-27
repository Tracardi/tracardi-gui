import PropertyField from "./PropertyField";
import DateValue from "../misc/DateValue";
import {BsGlobe} from "react-icons/bs";
import React from "react";
import IdLabel from "../misc/IconLabels/IdLabel";
import {ProfileDetailsById} from "./ProfileDetails";
import SessionContextInfo from "./SessionContextInfo";
import IconLabel from "../misc/IconLabels/IconLabel";
import PlatformIcon from "../misc/IconLabels/PlatformLabel";
import BrowserLabel from "../misc/IconLabels/BrowserLabel";
import ProfileLabel from "../misc/IconLabels/ProfileLabel";
import {displayLocation} from "../../../misc/location";
import Chip from "@mui/material/Chip";

export default function SessionRowCardInfo({session, displayContext=true}) {

    const labelWidth = 180
    const displayMoreContext = window?.CONFIG?.session?.display?.row?.moreContext
    const displayChannel = window?.CONFIG?.session?.display?.row?.channel

    return <>
        <PropertyField labelWidth={labelWidth} name="Id" content={<IdLabel label={session?.id}/>}/>
        {displayChannel && session?.metadata?.channel && <PropertyField
            labelWidth={labelWidth}
            name="Channel"
            content={session?.metadata?.channel}/>}

        <PropertyField labelWidth={labelWidth} name="Started"
                       content={<>
                           <DateValue date={session?.metadata?.time?.insert}/>
                           {session?.context?.time?.tz && <IconLabel
                               value={session?.context?.time?.tz}
                               style={{marginLeft: 5}}
                               icon={<BsGlobe size={20} style={{marginRight: 5}}/>}
                           />}
                       </>
                       }/>
        {session?.device?.geo?.city && <PropertyField labelWidth={labelWidth} name="Location" content={
            <IconLabel
                value={displayLocation(session?.device?.geo)}
                icon={<BsGlobe size={20} style={{marginRight: 5}}/>}
            />}/>}
        {session?.os?.name && <PropertyField
            labelWidth={labelWidth}
            name="OS"
            content={<PlatformIcon os={session.os.name} platform={session?.context?.browser?.local?.device?.platform}/>}
        />}
        {session?.app?.name && <PropertyField
            labelWidth={labelWidth}
            name="Application"
            content={<BrowserLabel browser={session.app.name} version={session.app.version} robot={session.app.bot}/>}
        />}

        {session?.utm?.source && <PropertyField
            labelWidth={labelWidth}
            name="UTM"
            content={<Chip size="small" label={session?.utm?.source}/>}
        />}

        {session?.profile?.id && <PropertyField
            labelWidth={labelWidth}
            name={window?.CONFIG?.profile?.id  || "Profile id"}
            content={<ProfileLabel label={session.profile.id}
                                   profileIcon={window?.CONFIG?.profile?.icon1 || 'profile'}/>}
            underline={false}
            drawerSize={1250}
        >
            <ProfileDetailsById id={session?.profile?.id}/>
        </PropertyField>}
        <div style={{marginTop: 20}}>
            {displayContext && displayMoreContext && session?.id && <SessionContextInfo sessionId={session?.id}/>}
        </div>
    </>
}