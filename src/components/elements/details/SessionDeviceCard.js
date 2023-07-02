import PropertyField from "./PropertyField";
import IconLabel from "../misc/IconLabels/IconLabel";
import {BsGlobe} from "react-icons/bs";
import {displayLocation} from "../../../misc/location";
import PlatformIcon from "../misc/IconLabels/PlatformLabel";
import BrowserLabel from "../misc/IconLabels/BrowserLabel";
import React from "react";

export default function SessionDeviceCard({session}) {

    const labelWidth = 180

    return <>
        {session?.device?.geo?.country && <PropertyField labelWidth={labelWidth} name="Location" content={
            <IconLabel
                value={displayLocation(session?.device?.geo)}
                icon={<BsGlobe size={20} style={{marginRight: 5}}/>}
            />}/>}
        {session?.context?.time?.tz && <PropertyField labelWidth={labelWidth} name="Time zone"
                                                      content={<IconLabel
                                                          value={session?.context?.time?.tz}
                                                          icon={<BsGlobe size={20} style={{marginRight: 5}}/>}
                                                      />}/>
        }

        {session?.app?.name && <PropertyField
            labelWidth={labelWidth}
            name="Application"
            content={<BrowserLabel browser={session.app.name} version={session.app.version} robot={session.app.bot}/>}
        />}

        {session?.os?.name && <PropertyField
            labelWidth={labelWidth}
            name="OS"
            content={<PlatformIcon os={session.os.name} platform={session?.context?.browser?.local?.device?.platform}/>}
        />}

        {session?.device?.name && <PropertyField labelWidth={labelWidth} name="Device name" content={session?.device?.name}/>}
        {session?.device?.type && <PropertyField labelWidth={labelWidth} name="Device type" content={session?.device?.type}/>}
        {session?.device?.brand && <PropertyField labelWidth={labelWidth} name="Device brand" content={session?.device?.brand}/>}
        {session?.device?.model && <PropertyField labelWidth={labelWidth} name="Device model" content={session?.device?.model}/>}
    </>
}