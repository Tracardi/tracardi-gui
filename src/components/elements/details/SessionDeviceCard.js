import PropertyField from "./PropertyField";
import PlatformIcon from "../misc/IconLabels/PlatformLabel";
import BrowserLabel from "../misc/IconLabels/BrowserLabel";
import React from "react";
import {LuFlipHorizontal, LuFlipVertical} from "react-icons/lu";
import {BsPhone, BsLaptop} from "react-icons/bs";
import Tag from "../misc/Tag";
import { VscSymbolColor } from "react-icons/vsc";

export default function SessionDeviceCard({session}) {

    const labelWidth = 180

    return <>
        <PropertyField
            labelWidth={labelWidth}
            name="Application"
            content={<BrowserLabel browser={session?.app?.name || "Unknown"} version={session?.app?.version || ""}
                                   robot={session?.app?.bot || ""}/>}
        />

        <PropertyField
            labelWidth={labelWidth}
            name="OS"
            content={<PlatformIcon os={session?.os?.name || "Unknown"}
                                   platform={session?.context?.browser?.local?.device?.platform || ""}/>}
        />

        {session?.context?.device?.gpu?.vendor?.name && <PropertyField
            labelWidth={labelWidth}
            name="GPU Vendor"
            content={session.context.device.gpu.vendor.name}/>}

        {session?.context?.device?.gpu?.renderer?.renderer && <PropertyField
            labelWidth={labelWidth}
            name="GPU Name"
            content={session.context.device.gpu.renderer.renderer}/>}

        {session?.device?.resolution &&
        <PropertyField labelWidth={labelWidth} name="Resolution" content={<>
            {session?.device?.orientation.startsWith('landscape')
                ? <LuFlipVertical size={20} style={{marginRight: 5}}/>
                : <LuFlipHorizontal size={20} style={{marginRight: 5}}/>}
            {session?.device?.resolution}
            {session?.device?.color_depth && <><VscSymbolColor size={20} style={{marginRight: 5, marginLeft: 15}}/> {session?.device?.color_depth}b colors</>}
            </>
            }/>}

        {session?.device?.name &&
        <PropertyField labelWidth={labelWidth} name="Device name" content={<>
            {session?.device?.touch
                ? <BsPhone size={20} style={{marginRight: 5}}/>
                : <BsLaptop size={20} style={{marginRight: 5}}/>}
            {session?.device?.name}
            {session?.device?.type && <Tag style={{marginLeft: 5}}>{session?.device?.type}</Tag>}
            </>}/>}

        {session?.device?.brand &&
        <PropertyField labelWidth={labelWidth} name="Device brand" content={<>
            {session?.device?.brand} {session?.device?.model}
        </>}/>}

    </>
}