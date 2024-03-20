import PropertyField from "./PropertyField";
import DateValue from "../misc/DateValue";
import React from "react";
import IdLabel from "../misc/IconLabels/IdLabel";
import {ProfileDetailsById} from "./ProfileDetails";
import SessionContextInfo from "./SessionContextInfo";
import ProfileLabel from "../misc/IconLabels/ProfileLabel";
import Chip from "@mui/material/Chip";

export default function SessionCardInfo({session, displayContext=true}) {

    const labelWidth = 150
    const displayMoreContext = window?.CONFIG?.session?.display?.row?.moreContext
    const displayChannel = window?.CONFIG?.session?.display?.row?.channel

     return <>
        <PropertyField labelWidth={labelWidth} name="Id" content={<IdLabel label={session?.id}/>}/>
        {displayChannel && session?.metadata?.channel && <PropertyField
            labelWidth={labelWidth}
            name="Channel"
            content={session?.metadata?.channel}/>}

        <PropertyField labelWidth={labelWidth} name="Started"
                       content={<DateValue date={session?.metadata?.time?.insert}/>
                       }/>

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