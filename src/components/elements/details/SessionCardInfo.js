import PropertyField from "./PropertyField";
import DateValue from "../misc/DateValue";
import {BsGlobe} from "react-icons/bs";
import React from "react";
import IdLabel from "../misc/IconLabels/IdLabel";
import {ProfileDetailsById} from "./ProfileDetails";
import TimeValue from "../misc/TimeValue";
import SessionContextInfo from "./SessionContextInfo";
import IconLabel from "../misc/IconLabels/IconLabel";
import PlatformIcon from "../misc/IconLabels/PlatformLabel";
import BrowserLabel from "../misc/IconLabels/BrowserLabel";

export default function SessionCardInfo({session}) {
    const labelWidth = 180
    return <>
        <PropertyField labelWith={labelWidth} name="Id" content={<IdLabel label={session?.id}/>}/>
        <PropertyField labelWith={labelWidth} name="Started"
                       content={<>
                           <DateValue date={session?.metadata?.time?.insert}/>
                           {session?.context?.time?.tz && <IconLabel
                               value={session?.context?.time?.tz}
                               style={{marginLeft: 5}}
                               icon={<BsGlobe size={20} style={{marginRight: 5}}/>}
                           />}
                       </>
                       }/>

        {session?.metadata?.time?.duration && <PropertyField
            labelWith={labelWidth}
            name="Duration"
            content={<TimeValue time={session?.metadata?.time?.duration}/>}
        />}
        {session?.context?.browser?.local?.device?.platform && <PropertyField
            labelWith={labelWidth}
            name="Platform"
            content={<PlatformIcon platform={session.context.browser.local.device.platform}/>}
        />}
        {session?.context?.browser?.local?.browser?.name && <PropertyField
            labelWith={labelWidth}
            name="Browser"
            content={<BrowserLabel browser={session.context.browser.local.browser.name} />}
        />}

        {session?.profile?.id && <PropertyField
            labelWith={labelWidth}
            name="Profile id"
            content={<IdLabel label={session.profile.id}/>}
            underline={false}
            drawerSize={1250}
        >
            <ProfileDetailsById id={session?.profile?.id}/>
        </PropertyField>}

        <div style={{marginTop: 20}}>
            {session?.id && <SessionContextInfo sessionId={session?.id}/>}
        </div>
    </>
}