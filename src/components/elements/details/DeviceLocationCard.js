import PropertyField from "./PropertyField";
import IconLabel from "../misc/IconLabels/IconLabel";
import {BsGlobe} from "react-icons/bs";
import {displayLocation} from "../../../misc/location";
import React from "react";

export default function DeviceLocationCard({geo, timezone}) {

    const labelWidth = 180

    return <>
        {geo?.country && <PropertyField labelWidth={labelWidth} name="Location" content={
            <IconLabel
                value={displayLocation(geo)}
                icon={<BsGlobe size={20} style={{marginRight: 5}}/>}
            />}/>}
        {geo.longitude && <PropertyField labelWidth={labelWidth} name="Longitude"
                                         content={<IconLabel
                                             value={geo.longitude}
                                         />}/>}
        {geo.latitude && <PropertyField labelWidth={labelWidth} name="Latitude"
                                        content={<IconLabel
                                            value={geo.latitude}
                                        />}/>}
        {timezone && <PropertyField labelWidth={labelWidth} name="Time zone"
                                    content={<IconLabel
                                        value={timezone}
                                        icon={<BsGlobe size={20} style={{marginRight: 5}}/>}
                                    />}/>
        }
    </>
}