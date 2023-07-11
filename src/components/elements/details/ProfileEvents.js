import React, {useState} from "react";
import {Step, StepLabel, Stepper} from "@mui/material";
import "./ProfileEvents.css";
import DateValue from "../misc/DateValue";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import {useFetch} from "../../../remote_api/remoteState";
import {getProfileEvents} from "../../../remote_api/endpoints/profile";
import EventDetailsDialog from "../dialog/EventDetailsDialog";
import {capitalizeString} from "../misc/EventTypeTag";

const stepIconComponent = event => {
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
                {events.map(event => (
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
                ))}
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

    if(isLoading) {
        return <CenteredCircularProgress/>
    }

    return <EventStream events={data.result}/>
}