import React, {useState} from "react";
import PropTypes from 'prop-types';
import {TuiFormGroup, TuiFormGroupContent, TuiFormGroupField} from "../tui/TuiForm";
import {TuiSelectEventSource} from "../tui/TuiSelectEventSource";
import TuiSelectEventType from "../tui/TuiSelectEventType";
import JsonEditor from "../editors/JsonEditor";
import Tabs, {TabCase} from "../tabs/Tabs";
import Button from "./Button";
import {objectMap} from "../../../misc/mappers";
import "./TrackerPayloadEventList.css";
import {VscEdit, VscSymbolEvent} from "react-icons/vsc";
import {BsTrash} from "react-icons/bs";
import IconButton from "../misc/IconButton";
import {isEmptyObjectOrNull} from "../../../misc/typeChecking";


function TrackerPayloadEventList({events, onChange}) {

    const eventsObj = {};

    for (const key of events) {
        eventsObj[key] = events;
    }

    const [eventList, setEventsList] = useState(eventsObj)
    const [tab, setTab] = useState(0)
    const [event, setEvent] = useState(null)

    const handleAddNewEvent = () => {
        if(event === null) {
            setEvent({
                type: {
                    name: "",
                    id: ""
                },
                properties: "{}",
                context: "{}"
            })
        } else {
            if(!isEmptyObjectOrNull(event) && event.type.id !== "") {
               handleChange(event)
            }
        }
    }

    const handleChange = (_event) => {
        const _eventList = {...eventList, [event.type.id]: _event}
        setEventsList(_eventList)
        if(onChange instanceof Function) {
            const listOfEvents = [];
            for (const [key, value] of Object.entries(eventList)) {
                listOfEvents.push({...value, type: value.type.id})
            }
            onChange(listOfEvents)
            console.log(listOfEvents)
        }
    }

    const handleEdit = (eventType) => {
        setEvent(eventList[eventType])
    }

    const handleDelete = (eventType) => {
        setEventsList(current => {
            const {[eventType]: undefined, ...eventList} = current;
            return eventList;
        });
    }

    const handleEventTypeChange = (value) => {
        value = {...event, type: value}
        setEvent(value)
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

    const listOfEvents = () => <div className="TpEventList">
        {objectMap(eventList, (key, event) => {
            return <div key={key} style={{display: "flex", justifyContent: "space-between", flexDirection: "row"}}>
                <div className="flexLine" >
                    <VscSymbolEvent size={20} />
                    {event.type.name}
                </div>
                <div className="flexLine" >
                        <IconButton label={"Delete"}
                                    style={{color:"black", padding: 2}}
                                    onClick={() => handleEdit(event.type.id)}>
                            <VscEdit size={20}/>
                        </IconButton>

                    <IconButton label={"Delete"}
                                               style={{color:"black", padding: 2}}
                                               onClick={() => handleDelete(event.type.id)}>
                        <BsTrash size={20}/>
                    </IconButton>
                </div>
            </div>
        })}
    </div>

    return <>
        {listOfEvents()}
        {event && <>
            <fieldset>
                <legend>New event</legend>
                <TuiSelectEventType onlyValueWithOptions={false}
                                    initValue={event.type}
                                    value={event.type}
                                    onSetValue={handleEventTypeChange}/>
            </fieldset>

            <Tabs tabs={["Event Properties", "Event Context"]} defaultTab={tab}
                  onTabSelect={setTab}>
                <TabCase id={0}>
                    <fieldset style={{marginTop: 10}}>
                        <legend>Event Properties</legend>
                        <JsonEditor value={event?.properties}
                                    onChange={handlePropertiesChange}/>
                    </fieldset>
                </TabCase>
                <TabCase id={1}>
                    <fieldset style={{marginTop: 10}}>
                        <legend>Event Context</legend>
                        <JsonEditor value={event?.context} onChange={handleContextChange}/>
                    </fieldset>
                </TabCase>
            </Tabs></>}
        <Button label="Add event" onClick={handleAddNewEvent}/></>
}

export default function TrackerPayloadFormGroup({onChange, value}) {

    if (!value) {
        value = {
            source: {
                id: null,
            },
            context: {},
            properties: {},
            events: [],
            options: {},
            profile_less: true
        }
    }

    const [data, setData] = useState(value);

    const mounted = React.useRef(false);

    React.useEffect(() => {
        mounted.current = true;
        return () => mounted.current = false;
    }, [])

    const handleChange = (value) => {
        setData({...data, events: value})
    }

    const handleSourceChange = (value) => {
        setData({...data, source: {id: value.id}})
    }

    return <TuiFormGroup>
        <TuiFormGroupContent>
            <TuiFormGroupField header="Source" description="Select event source though which the data will be collected.">
                <TuiSelectEventSource value={data.source} onSetValue={handleSourceChange}/>
            </TuiFormGroupField>
            <TuiFormGroupField header="Events" description="Add events to tracker payload.">
                <TrackerPayloadEventList events={value.events} onChange={handleChange}/>
            </TuiFormGroupField>
        </TuiFormGroupContent>
    </TuiFormGroup>
}

TrackerPayloadFormGroup.propTypes = {onChange: PropTypes.func, value: PropTypes.object}