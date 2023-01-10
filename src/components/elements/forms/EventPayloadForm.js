import React, {useState} from "react";
import TuiSelectEventType from "../tui/TuiSelectEventType";
import Tabs, {TabCase} from "../tabs/Tabs";
import JsonEditor from "../editors/JsonEditor";
import FieldSet from "../misc/FieldSet";

export default function EventPayloadForm ({value, onChange}) {

    const [jsonError, setJsonError] = useState(false)
    const [typeError, setTypeError] = useState(false)

    if (!value) {
        value = {
            type: {
                name: "",
                id: ""
            },
            properties: "{}",
            context: "{}"
        }
    }

    if(!value?.type?.id) {
        value = {...value, type: {id: value.type, name: value.type}}
    }

    if (!(value?.properties instanceof String)) {
        value = {...value, properties: JSON.stringify(value.properties, null, " ")}
    }

    if (!(value?.context instanceof String)) {
        value = {...value, context: JSON.stringify(value.context, null, " ")}
    }

    const [tab, setTab] = useState(0)
    const [event, setEvent] = useState(value)

    const handleChange = (event) => {

        event = {...event, type: event.type.id}

        console.log("cange", event)
        if (onChange instanceof Function) {
            try {
                setJsonError(false);
                setTypeError(false);
                if (event.type === "") {
                    setTypeError(true)
                }
                const output = {
                ...event,
                    properties: JSON.parse(event.properties),
                    context: JSON.parse(event.context),
                }
                onChange(output)
            } catch(e) {
                setJsonError(true)
            }
        }
    }

    const handleEventTypeChange = (value) => {
        const _event = {...event, type: value}
        setEvent(_event)
        handleChange(_event)
    }

    const handlePropertiesChange = (value) => {
        const _event = {...event, properties: value}
        setEvent(_event)
        handleChange(_event)
    }

    const handleContextChange = (value) => {
        const _event = {...event, context: value}
        setEvent(_event)
        handleChange(_event)
    }

    return <><FieldSet error={typeError} label="Event type">
        <TuiSelectEventType onlyValueWithOptions={false}
                            initValue={event.type}
                            value={event.type}
                            onSetValue={handleEventTypeChange}
        />
    </FieldSet>

        <Tabs tabs={["Event Properties", "Event Context"]} defaultTab={tab}
              onTabSelect={setTab}>
            <TabCase id={0}>
                <FieldSet error={jsonError} label="Event Properties">
                    <JsonEditor value={event?.properties}
                                onChange={handlePropertiesChange}/>
                </FieldSet>
            </TabCase>
            <TabCase id={1}>
                <FieldSet error={jsonError} label="Event Context">
                    <JsonEditor value={event?.context} onChange={handleContextChange}/>
                </FieldSet>
            </TabCase>
        </Tabs></>

}