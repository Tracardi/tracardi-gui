import React from "react";
import {FlowProfiling} from "../../flow/FlowProfiling";
import {convertDebugInfoToProfilingData} from "../../flow/profilingConverter";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import NoData from "../misc/NoData";
import {useFetch} from "../../../remote_api/remoteState";
import {getEventDebugLogs} from "../../../remote_api/endpoints/event";
import FetchError from "../../errors/FetchError";

const ListOfProfilingData = ({data}) => {
    if (Array.isArray(data)) {
        if(data.length>0) {
            return data.map(
                (data, index) => <FlowProfiling key={index} flow={data?.flow} profilingData={convertDebugInfoToProfilingData(data)} orientation="horizontal"/>
            )
        }
        return <NoData header="This event was not configured to store debug data.">
            <p style={{textAlign: "center"}}>In order to see debug data, start node in workflow must be configured to collect debbuger
                information, and environment variable TRACK_DEBUG must be equal to <b>yes</b>. You can also force debugging with track payload options set to debugger=true.</p>
        </NoData>
    }
    return ""
}

const EventProfilingDetails = ({eventId}) => {

    const {data, isLoading, error} = useFetch(
        ["eventDebugData", [eventId]],
        getEventDebugLogs(eventId),
        data => {return data}
        )

    if (isLoading) {
        return <CenteredCircularProgress/>
    }

    if(error) {
        return <FetchError error={error} />
    }

    return <ListOfProfilingData data={data}/>
}

export default EventProfilingDetails;

