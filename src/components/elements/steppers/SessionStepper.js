import React from "react";
import {Stepper, Step, StepLabel} from "@mui/material";
import "./SessionStepper.css";

export default function SessionStepper({eventsData, onEventSelect = null}) {

    const stepIconComponent = event => {
        return <div className="StepIcon" style={{
            backgroundColor: {
                collected: "#006db3",
                error: "#d81b60",
                processed: "#43a047"
            }[event.status]
        }}/>
    }

    return <div className="SessionStepper">
        {Array.isArray(eventsData) && eventsData.length > 0 && <Stepper
            orientation="vertical"
            connector={<div className="StepConnector"/>}
        >
            {
                eventsData.map(event => (
                    <Step
                        completed={false}
                        active={false}
                        key={event.id}
                        onClick={onEventSelect === null ? () => {
                        } : () => onEventSelect(event.id)}
                    >
                        <div style={{
                            alignSelf: "center",
                            paddingLeft: 8,
                            paddingRight: 8
                        }}>{event.insert.substring(11, 19)}</div>
                        <StepLabel
                            StepIconComponent={() => stepIconComponent(event)}
                        >
                            {event.type}
                        </StepLabel>
                    </Step>
                ))
            }
        </Stepper>
        }
    </div>
}