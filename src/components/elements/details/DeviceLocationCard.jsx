import PropertyField from "./PropertyField";
import IconLabel from "../misc/IconLabels/IconLabel";
import {BsGlobe, BsLaptop} from "react-icons/bs";
import {displayLocation} from "../../../misc/location";
import React from "react";
import Tag from "../misc/Tag";

export default function DeviceLocationCard({device, timezone}) {

    const labelWidth = 180

    return <>
        {device?.geo?.country && <PropertyField labelWidth={labelWidth} name="Country" content={
            <IconLabel
                value={displayLocation(device?.geo)}
                icon={<BsGlobe size={20} style={{marginRight: 5}}/>}
            />}/>}
        {(device?.geo?.longitude && device?.geo?.latitude) && <PropertyField
            labelWidth={labelWidth} name="Location"
            content={<><Tag>lon: {device.geo.longitude}</Tag><Tag>lat: {device.geo.latitude}</Tag></>}/>}
        {timezone && <PropertyField labelWidth={labelWidth} name="Time zone"
                                    content={<IconLabel
                                        value={timezone}
                                        icon={<BsGlobe size={20} style={{marginRight: 5}}/>}
                                    />}/>
        }
        {device?.ip && <PropertyField labelWidth={labelWidth} name="IP"
                                      content={<IconLabel
                                          value={device.ip}
                                          icon={<BsLaptop size={20} style={{marginRight: 5}}/>}
                                      />}/>}
    </>
}