import PropertyField from "./PropertyField";
import DateValue from "../misc/DateValue";
import {BsApple, BsGlobe, BsWindows} from "react-icons/bs";
import React from "react";
import {VscTerminalLinux} from "react-icons/vsc";
import IdLabel from "../misc/IconLabels/IdLabel";
import {ProfileDetailsById} from "./ProfileDetails";
import TimeValue from "../misc/TimeValue";
import SessionContextInfo from "./SessionContextInfo";
import {TuiForm} from "../tui/TuiForm";

function PlatformIcon({platform}) {
    const platforms = {
        "Win32": <BsWindows size={20} style={{marginRight: 5}}/>,
        "MacIntel": <BsApple size={20} style={{marginRight: 5}}/>,
        "Linux x86_64": <VscTerminalLinux size={20} style={{marginRight: 5}}/>
    }
    if (platform in platforms) {
        return <>{platforms[platform]} {platform}</>
    }

    return platform
}

export default function SessionCardInfo({session}) {
    return <>
        <PropertyField name="Id" content={<IdLabel label={session?.id}/>}/>
        <PropertyField name="Created" content={<DateValue date={session?.metadata?.time?.insert}/>}/>
        {session?.context?.time?.tz && <PropertyField
            name="Time zone"
            content={<><BsGlobe size={20} style={{marginRight: 5}}/> {session?.context.time.tz}</>}
        />}
        {session?.metadata?.time?.duration && <PropertyField
            name="Duration"
            content={<TimeValue time={session?.metadata?.time?.duration}/>}
        />}
        {session?.context?.browser?.local?.device?.platform && <PropertyField
            name="Platform"
            content={<PlatformIcon platform={session.context.browser.local.device.platform}/>}
        />}
        {session?.context?.browser?.local?.browser?.name && <PropertyField
            name="Browser"
            content={session.context.browser.local.browser.name}
        />}

        {session?.profile?.id && <PropertyField name="Profile id"
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