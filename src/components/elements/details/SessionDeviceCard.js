import PropertyField from "./PropertyField";
import PlatformIcon from "../misc/IconLabels/PlatformLabel";
import BrowserLabel from "../misc/IconLabels/BrowserLabel";
import React from "react";

export default function SessionDeviceCard({session}) {

    const labelWidth = 180

    return <>
        <PropertyField
            labelWidth={labelWidth}
            name="Application"
            content={<BrowserLabel browser={session?.app?.name || "Unknown"} version={session?.app?.version || ""} robot={session?.app?.bot || ""}/>}
        />

        <PropertyField
            labelWidth={labelWidth}
            name="OS"
            content={<PlatformIcon os={session?.os?.name || "Unknown"} platform={session?.context?.browser?.local?.device?.platform || ""}/>}
        />

        {session?.device?.name && <PropertyField labelWidth={labelWidth} name="Device name" content={session?.device?.name}/>}
        {session?.device?.type && <PropertyField labelWidth={labelWidth} name="Device type" content={session?.device?.type}/>}
        {session?.device?.brand && <PropertyField labelWidth={labelWidth} name="Device brand" content={session?.device?.brand}/>}
        {session?.device?.model && <PropertyField labelWidth={labelWidth} name="Device model" content={session?.device?.model}/>}
    </>
}