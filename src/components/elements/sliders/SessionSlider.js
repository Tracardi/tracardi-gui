import React from "react";
import SessionStepper from "../steppers/SessionStepper";
import {asyncRemote, getError} from "../../../remote_api/entrypoint";
import "./SessionSlider.css";
import {Slider} from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import Button from "../forms/Button";
import {FiMoreHorizontal} from "react-icons/fi";
import NoData from "../misc/NoData";
import ErrorsBox from "../../errors/ErrorsBox";

export default function SessionSlider({profileId}) {

    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [offset, setOffset] = React.useState(0);
    const [eventsData, setEventsData] = React.useState(null);
    const [hasMore, setHasMore] = React.useState(false);
    const [limit, setLimit] = React.useState(20);
    const [noData, setNoData] = React.useState(false);

    React.useEffect(() => {
        let subscribed = true;
        setLoading(true);
        setError(null);
        setNoData(false);
        setLimit(20);
        asyncRemote({
            url: "/session/profile/" + profileId + "?n=" + -offset
        })
            .then(async response => {
                if (subscribed) {
                    const session = response.data
                    if (session !== null) {
                        try {
                            const response = await asyncRemote({
                                url: "/events/session/" + session.id + "?limit=" + limit
                            })

                            if (response) {
                                setEventsData(response.data.result);
                                setHasMore(response.data.more_to_load);
                            }
                        } catch (e) {
                            setError(getError(e));
                            setHasMore(false);
                        }
                    } else {
                        setNoData(true)
                        setEventsData(null);
                        setHasMore(false);
                    }
                }
            })
            .catch(e => {
                if (subscribed) setError(getError(e))
            })
            .finally(() => {
                if (subscribed) setLoading(false)
            })
        return () => subscribed = false;
    }, [offset, profileId, limit])


    return <div className="SessionSlider">
        <div style={{
            display: 'flex',
            flexDirection: "row",
            width: "100%",
            justifyContent: "center",
            alignContent: "space-between",
            marginTop: 10
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

        {/*<header className="Header">{session && `Session: ${Math.floor(session.duration / 60)} minutes on ${session.insert.substring(0, 10)}`}</header>*/}
        <div style={{height: 5, width: "100%"}}>{loading && <LinearProgress/>}</div>

        {eventsData && <SessionStepper eventsData={eventsData} onEventSelect={eventId => console.log(eventId)}/>}
        {noData && <div style={{height: "577px", display: "flex", alignItems: "center"}}><NoData
            header="No data found for defined session offset" fontSize="16px"/></div>}
        {error && <ErrorsBox errorList={error} style={{alignSelf: "flex-start"}}/>}
        {hasMore && <Button
            label={"LOAD MORE"}
            icon={<FiMoreHorizontal/>}
            onClick={() => setLimit(limit + 20)}
            progress={loading}
            style={{width: "100%", display: "flex", justifyContent: 'center'}}
        />}

    </div>
}