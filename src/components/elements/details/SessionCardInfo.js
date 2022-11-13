import PropertyField from "./PropertyField";
import DateValue from "../misc/DateValue";
import {BsApple, BsClock, BsGlobe, BsWindows} from "react-icons/bs";
import React from "react";
import {VscTerminalLinux} from "react-icons/vsc";
import IdLabel from "../misc/IconLabels/IdLabel";
import {ProfileDetailsById} from "./ProfileDetails";

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
            content={<><BsClock size={20}
                                style={{marginRight: 5}}/> {Math.floor(session?.metadata.time.duration / 60)}m</>}
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
    </>
}