import React from "react";
import {Stepper, Step, StepLabel} from "@mui/material";
import {asyncRemote, getError} from "../../../remote_api/entrypoint";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import "./SessionStepper.css";
import Button from "../forms/Button";
import {FiMoreHorizontal} from "react-icons/fi";
import ErrorsBox from "../../errors/ErrorsBox";

export default function SessionStepper({session, profileId, onEventSelect}) {

    const [eventsData, setEventsData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [limit, setLimit] = React.useState(20);
    const [hasMore, setHasMore] = React.useState(false);
    const [selectedEvent, setSelectedEvent] = React.useState(null);

    const handleEventSelect = React.useCallback((eventId) => {
        setSelectedEvent(eventId)
        if (onEventSelect instanceof Function) {
            onEventSelect(eventId)
        }
    }, [onEventSelect])

    React.useEffect(() => {
        let subscribed = true;
        if (session !== null) {
            setLoading(true);
            setError(null);
            asyncRemote({
                url: "/events/session/" + session.id + "/profile/" + profileId + "?limit=" + limit
            })
                .then(response => {
                    if (subscribed) {
                        setEventsData(response.data.result);
                        setHasMore(response.data.more_to_load);
                    }
                })
                .catch(e => {
                    if (subscribed) setError(getError(e))
                })
                .finally(() => {
                    if (subscribed) setLoading(false)
                })
        }
        return () => subscribed = false;
    }, [limit, session, profileId])

    React.useEffect(() => {
        if (limit === 20) {
            if (Array.isArray(eventsData) && eventsData.length > 0) {
                if (selectedEvent === null) {
                    handleEventSelect(eventsData[0]["id"])
                }
            }
        }
    }, [limit, eventsData, handleEventSelect, selectedEvent])

    const stepIconComponent = event => {
        return <div className="StepIcon" style={{
            backgroundColor: {
                collected: "#006db3",
                error: "#d81b60",
                processed: "#43a047"
            }[event.status]
        }}/>
    }

    if (loading && Array.isArray(eventsData) && eventsData.length === 0) {
        return <CenteredCircularProgress/>
    }

    if (error) {
        return <ErrorsBox errorList={error} style={{alignSelf: "flex-start"}}/>
    }

    return <div className="SessionStepper">
        {session && <header className="Header">Session starting {session.insert.substring(0, 10)},
            duration {Math.floor(session.duration / 60)} minutes</header>}
        {Array.isArray(eventsData) && eventsData.length > 0 && <Stepper
            orientation="vertical"
            connector={<div className="StepConnector"/>}
        >
            {
                eventsData.map(event => (
                    <Step
                        completed={true}
                        key={event.id}
                        onClick={() => handleEventSelect(event.id)}
                    >
                        <div style={{
                            alignSelf: "center",
                            paddingLeft: 8,
                            paddingRight: 8
                        }}>{event.insert.substring(11, 19)}</div>
                        <StepLabel
                            StepIconComponent={() => stepIconComponent(event)}
                        >
                            {selectedEvent === event.id ? <b>{event.type}</b> : event.type}
                        </StepLabel>
                    </Step>
                ))
            }
        </Stepper>
        }
        {hasMore && <Button
            label={"LOAD MORE"}
            icon={<FiMoreHorizontal/>}
            onClick={() => setLimit(limit + 20)}
            progress={loading}
            style={{width: "100%", display: "flex", justifyContent: 'center'}}
        />}
    </div>
}