import React from "react";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import FlowLogs from "../../flow/FlowLogs";
import NoData from "../misc/NoData";
import {useFetch} from "../../../remote_api/remoteState";
import {getEventLogs} from "../../../remote_api/endpoints/event";
import FetchError from "../../errors/FetchError";

const EventLogDetails = ({eventId}) => {

    const {data, isLoading, error} = useFetch(
        ["eventLogs", [eventId]],
        getEventLogs(eventId),
        data => {
            return data
        }
    )

    if(isLoading) {
        return <CenteredCircularProgress/>
    }

    if(error) {
        return <FetchError error={error}/>
    }

    if (Array.isArray(data?.result)) {
        if(data?.total > 0) {
            return <FlowLogs logs={data?.result}/>
        }
        return <NoData header="This event has no logs."/>
    }



    return ""
}

export default EventLogDetails;
