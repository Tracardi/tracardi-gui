import React, {useState} from "react";
import {Step, StepLabel, Stepper} from "@mui/material";
import "./ProfileEvents.css";
import DateValue from "../misc/DateValue";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import {useFetch} from "../../../remote_api/remoteState";
import {getProfileEvents} from "../../../remote_api/endpoints/profile";
import EventDetailsDialog from "../dialog/EventDetailsDialog";
import {capitalizeString} from "../misc/EventTypeTag";
import {BsGear} from "react-icons/bs";
import NoData from "../misc/NoData";

const stepIconComponent = event => {
    if (event?.source?.id.startsWith("@internal")) {
        return <BsGear size={12} style={{marginRight: 10}}/>
    }
    return <div className="EventIcon" style={{
        backgroundColor: {
            collected: "#006db3",
            error: "#d81b60",
            processed: "#43a047"
        }[event?.metadata?.status]
    }}/>
}


function EventStream({events}) {

    const [currentEvent, setCurrentEvent] = useState(null)
    const [open, setOpen] = useState(false)

    const handleDetails = (event) => {
        setCurrentEvent(event)
        setOpen(true)
    }

    return <>
        <EventDetailsDialog event={currentEvent}
                            open={open}
                            onClose={() => setOpen(false)}
        />
        <div className="EventStream">
            <Stepper
                orientation="vertical"
                connector={<div className="EventConnector"/>}
            >
                {
                    Array.isArray(events) && events.length > 0
                        ? events.map(event => (
                            <Step
                                completed={true}
                                key={event.id}
                            >
                                <div style={{
                                    alignSelf: "center",
                                    paddingLeft: 8,
                                    paddingRight: 8,
                                    width: 320
                                }}><DateValue date={event?.metadata?.time?.insert}/></div>
                                <StepLabel
                                    StepIconComponent={() => stepIconComponent(event)}
                                    onClick={() => handleDetails(event)}
                                >
                                    {event?.name || capitalizeString(event?.type)}
                                </StepLabel>
                            </Step>

                        ))
                        : <NoData header="No events"><div align="center">Events are stored in batches, which means they will be visible after sometime the profile has been saved.</div></NoData>
                }

            </Stepper>
        </div>
    </>
}

export default function ProfileEvents({profileId}) {

    const {isLoading, data} = useFetch(
        ["profileEvents", profileId],
        getProfileEvents(profileId),
        (data) => data
    )

    if (isLoading) {
        return <CenteredCircularProgress/>
    }

    return <EventStream events={data.result}/>
}