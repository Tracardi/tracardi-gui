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

export default function SessionCardInfo({session}) {

    const labelWidth = 180
    const displayMoreContext = window?.CONFIG?.session?.display?.row?.moreContext

    return <>
        <PropertyField labelWidth={labelWidth} name="Id" content={<IdLabel label={session?.id}/>}/>
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
        {session?.context?.browser?.local?.device?.platform && <PropertyField
            labelWidth={labelWidth}
            name="Platform"
            content={<PlatformIcon platform={session.context.browser.local.device.platform}/>}
        />}
        {session?.context?.browser?.local?.browser?.name && <PropertyField
            labelWidth={labelWidth}
            name="Browser"
            content={<BrowserLabel browser={session.context.browser.local.browser.name} />}
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
            {displayMoreContext && session?.id && <SessionContextInfo sessionId={session?.id}/>}
        </div>
    </>
}