import React, {useState} from "react";
import PropTypes from 'prop-types';
import {TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import {TuiSelectEventSource} from "../tui/TuiSelectEventSource";
import TuiSelectEventType from "../tui/TuiSelectEventType";
import JsonEditor from "../editors/JsonEditor";
import Tabs, {TabCase} from "../tabs/Tabs";
import Button from "./Button";
import NoData from "../misc/NoData";
import {isEmptyObject} from "../../../misc/typeChecking";
import {objectMap} from "../../../misc/mappers";
import "./TrackerPayloadEventList.css";
import {VscEdit, VscSymbolEvent} from "react-icons/vsc";


function TrackerPayloadEventList({events}) {

    if (isEmptyObject(events)) {
        return <NoData header="No events added"/>
    }
    console.log(events)
    return <table className="TpEventList">
        {objectMap(events, (key, event) => {
            return <tr key={key}>
                <td width={20}><VscSymbolEvent size={20} /></td>
                <td>{event.type}</td>
                <td className="flexLine"><VscEdit size={20} style={{marginRight: 5}}/> Edit</td>
            </tr>
        })}
    </table>
}

function TrackerPayloadEvents({value}) {

    const [tab, setTab] = useState(0)
    const [events, setEvents] = useState({})
    const [event, setEvent] = useState(null)

    const handleAddNewEvent = () => {
        if(event === null) {
            setEvent({
                type: "",
                properties: "{}",
                context: "{}"
            })
        } else {
            setEvents({...events, [event.type.id]: {
                    ...event,
                    type: event.type.id,

                }})
        }

    }

    return <TuiFormGroupContent name="Events" description="Add events to tracker payload.">
        <TrackerPayloadEventList events={events}/>
        {event && <fieldset>
            <legend>New event</legend>
            <TuiSelectEventType onlyValueWithOptions={false} onSetValue={value => setEvent({...event, type: value})}/>
            <Tabs tabs={["Event Properties", "Event Context"]} defaultTab={tab}
                  onTabSelect={setTab}>
                <TabCase id={0}>
                    <fieldset style={{marginTop: 10}}>
                        <legend>Event Properties</legend>
                        <JsonEditor value={event?.properties} onChange={(value) => setEvent({...event, properties: value})}/>
                    </fieldset>
                </TabCase>
                <TabCase id={1}>
                    <fieldset style={{marginTop: 10}}>
                        <legend>Event Context</legend>
                        <JsonEditor value={event?.context} onChange={value => setEvent({...event, context: value})}/>
                    </fieldset>
                </TabCase>
            </Tabs>
        </fieldset>}

        <Button label="Add event" onClick={handleAddNewEvent}/>
    </TuiFormGroupContent>
}

export default function TrackerPayloadFormGroup({onChange, value}) {

    if (!value) {
        value = {
            source: {
                id: null,
            },
            // session: {
            //     id: null
            // },
            // profile: {
            //     id: null
            // },
            context: {},
            properties: {},
            events: [],
            options: {},
            profile_less: false
        }
    }

    const [data, setData] = useState(value);

    const mounted = React.useRef(false);

    React.useEffect(() => {
        mounted.current = true;
        return () => mounted.current = false;
    }, [])

    const handleChange = () => {

    }

    const handleSourceChange = () => {

    }

    return <TuiFormGroup>
        <TuiFormGroupContent>
            <TuiFormGroupField header="Source">
                <TuiSelectEventSource value={data.source} onSetValue={handleSourceChange}/>
            </TuiFormGroupField>
        </TuiFormGroupContent>
        <TrackerPayloadEvents value={data}/>
    </TuiFormGroup>
}

TrackerPayloadFormGroup.propTypes = {onChange: PropTypes.func, value: PropTypes.object}