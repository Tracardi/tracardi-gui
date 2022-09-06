import React from "react";
import SessionStepper from "../steppers/SessionStepper";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import {asyncRemote, getError} from "../../../remote_api/entrypoint";
import "./SessionSlider.css";
import {Slider} from "@mui/material";
import ErrorsBox from "../../errors/ErrorsBox";
import NoData from "../misc/NoData";

export default function SessionSlider({profileId, onEventSelect}) {

    const [session, setSession] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [offset, setOffset] = React.useState(0);

    React.useEffect(() => {
        let subscribed = true;
        setLoading(true);
        setError(null);
        asyncRemote({
            url: "/session/profile/" + profileId + "?n=" + -offset
        })
            .then(response => {
                if (subscribed) setSession(response.data)
            })
            .catch(e => {
                if (subscribed) setError(getError(e))
            })
            .finally(() => {
                if (subscribed) setLoading(false)
            })
        return () => subscribed = false;
    }, [offset, profileId])

    if (error) {
        return <ErrorsBox errorList={error} style={{marginTop: 20}}/>
    }

    return (
        <div className="SessionSlider">
            <div style={{
                display: 'flex',
                flexDirection: "row",
                width: "100%",
                justifyContent: "center",
                alignContent: "space-between",
                padding: 15
            }}>
                <header style={{display: "flex", alignItems: "center"}}>Session offset</header>
                <Slider
                    size="small"
                    defaultValue={0}
                    marks
                    valueLabelDisplay="auto"
                    min={-10}
                    max={0}
                    onChangeCommitted={(_, value) => setOffset(value)}
                />
            </div>
            { loading && <CenteredCircularProgress/>}
            {!loading && session === null && <div style={{
                height: "inherit",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <NoData header="No data found for defined session offset" fontSize="16px"/>
            </div>}
            {!loading && session !== null && <SessionStepper
                profileId={profileId}
                session={session}
                onEventSelect={onEventSelect}
            />}
        </div>
    );
}