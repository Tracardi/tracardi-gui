import React, {useEffect, useState} from "react";
import {asyncRemote} from "../../../remote_api/entrypoint";
import {Step, StepLabel, Stepper} from "@mui/material";
import "./ProfileEvents.css";
import DateValue from "../misc/DateValue";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";

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

    return <div className="EventStream">
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
                >
                    {event.type}
                </StepLabel>
            </Step>
        ))}
    </Stepper>
    </div>
}

export default function ProfileEvents({profileId}) {

    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        asyncRemote({
            url: `/events/profile/${profileId}`
        }).then((response) => {
            console.log(response.data)
            setEvents(response.data.result)
        }).finally(() => {
            setLoading(false)
        })
    }, [profileId])

    if(loading) {
        return <CenteredCircularProgress/>
    }

    return <EventStream events={events}/>
}