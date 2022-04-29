import React from "react";
import { Stepper, Step, StepLabel, StepContent } from "@mui/material";
import { asyncRemote, getError } from "../../../remote_api/entrypoint";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import "./SessionStepper.css";
import Button from "../forms/Button";
import {FiMoreHorizontal} from "react-icons/fi";
import ErrorsBox from "../../errors/ErrorsBox";
import NoData from "../misc/NoData";

export default function SessionStepper ({ session, onEventSelect = null }) {
    
    const [eventsData, setEventsData] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [limit, setLimit] = React.useState(20);
    const [hasMore, setHasMore] = React.useState(false);

    React.useEffect(() => {
        let subscribed = true;
        if (session !== null) {
            if (subscribed) setLoading(true);
            if (subscribed) setError(null);
            asyncRemote({
                url: "/events/session/" + session.id + "?limit=" + limit
            })
            .then(response => {
                if (subscribed) setEventsData(response.data.result); 
                if (subscribed) setHasMore(response.data.more_to_load); 
                if (onEventSelect !== null && subscribed && limit === 20) onEventSelect(response.data.result[0]["id"]);
            })
            .catch(e => {if (subscribed) setError(getError(e))})
            .finally(() => {if (subscribed) setLoading(false)})
        }
        return () => subscribed = false;
    }, [limit])

    const stepIconComponent = event => {
        return <div className="StepIcon" style={{backgroundColor: {collected: "#006db3", error: "#d81b60", processed: "#43a047"}[event.status]}}/>
    }

    return <div className="SessionStepper">
        <header className="Header">{session && `Events for session from ${session.insert.substring(0, 10)} with duration of ${Math.floor(session.duration / 60)} minutes`}</header>
        {Array.isArray(eventsData) && eventsData.length > 0 && <Stepper 
            orientation="vertical" 
            connector={<div className="StepConnector"/>}
        >
            {
            eventsData.map(event => (
                <Step 
                    completed={true}
                    key={event.id} 
                    onClick={onEventSelect === null ? () => {} : () => onEventSelect(event.id)}
                >
                    <div style={{alignSelf: "center", paddingLeft: 8, paddingRight: 8}}>{event.insert.substring(11, 19)}</div>
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
        {loading && Array.isArray(eventsData) && eventsData.length === 0 && <CenteredCircularProgress style={{marginTop: 10}}/>}
        {error && <ErrorsBox errorList={error} style={{alignSelf: "flex-start"}}/>}
        {session === null && <div style={{height: "577px", display: "flex", alignItems: "center", justifyContent: "center"}}><NoData header="No data found for defined session offset" fontSize="16px"/></div>}
        {hasMore && <Button 
            label={"LOAD MORE"} 
            icon={<FiMoreHorizontal />} 
            onClick={() => setLimit(limit + 20)} 
            progress={loading} 
            style={{width: "100%", display: "flex", justifyContent: 'center'}}
        />}
    </div>
}