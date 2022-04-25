import React from "react";
import SessionStepper from "../steppers/SessionStepper";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import { asyncRemote, getError } from "../../../remote_api/entrypoint";
import "./SessionSlider.css";
import { Slider } from "@mui/material";

export default function SessionSlider ({ profileId }) {

    const [sessionId, setSessionId] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [offset, setOffset] = React.useState(0);

    React.useEffect(() => {
        let subscribed = true;
        if (subscribed) setLoading(true);
        if (subscribed) setError(null);
        asyncRemote({
            url: "/session/profile/" + profileId + "?n=" + -offset
        })
        .then(response => {if (subscribed) setSessionId(response.data)})
        .catch(e => {if (subscribed) setError(getError(e))})
        .finally(() => {if (subscribed) setLoading(false)})
        return () => subscribed = false;
    }, [offset])

    return (
        <div className="SessionSlider">
            <header className="SliderHeader">{"Session data for profile " + profileId}</header> 
            <div style={{display: 'flex', flexDirection: "row", width: "100%", justifyContent: "center", alignContent: "space-between", marginTop: 10}}>
                <header style={{display: "flex", alignItems: "center"}}>Session offset</header>
                <Slider 
                    size="small"
                    defaultValue={0}
                    marks
                    valueLabelDisplay="auto"
                    min={-10}
                    max={0}
                    onChange={event => setOffset(event.target.value)}
                />
            </div>
            {loading && <CenteredCircularProgress />}
            {!loading && <SessionStepper sessionId={sessionId} onEventSelect={eventId => console.log(eventId)} loading={loading}/>}
        </div>
    );
}