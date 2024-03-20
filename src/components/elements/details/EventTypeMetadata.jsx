import {TuiFormGroup, TuiFormGroupContent} from "../tui/TuiForm";
import React from "react";
import PropertyField from "./PropertyField";
import IconLabel from "../misc/IconLabels/IconLabel";
import FlowNodeIcons from "../../flow/FlowNodeIcons";
import TuiTags from "../tui/TuiTags";
import ActiveTag from "../misc/ActiveTag";

export default function EventTypeMetadata({data}) {
    return <TuiFormGroup>
        <TuiFormGroupContent>
            {data?.event_type?.name
                ? <PropertyField
                    name="Event type"
                    content={<IconLabel value={data?.event_type.name}
                                        icon={<FlowNodeIcons icon="event"/>}
                    />}
                />
                : <PropertyField
                    name="Event type"
                    content={<IconLabel value={data?.event_type}
                                        icon={<FlowNodeIcons icon="event"/>}
                    />}
                />}
                <PropertyField name="Name" content={data?.name}/>
            <PropertyField name="Description" content={data?.description}/>
            <PropertyField name="Tags"
                           content={<TuiTags tags={data?.tags}
                                             size="small"/>}/>
            <PropertyField name="Enabled"
                           underline={false}
                           content={<ActiveTag active={data?.enabled}/>}/>
        </TuiFormGroupContent>
    </TuiFormGroup>
}