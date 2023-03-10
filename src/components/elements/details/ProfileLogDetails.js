import React from "react";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import FlowLogs from "../../flow/FlowLogs";
import NoData from "../misc/NoData";
import {useFetch} from "../../../remote_api/remoteState";
import {getProfileLogs} from "../../../remote_api/endpoints/profile";
import FetchError from "../../errors/FetchError";

const ProfileLogDetails = ({profileId}) => {

    const {data, isLoading, error} = useFetch(
        ["profileLogs", [profileId]],
        getProfileLogs(profileId),
        data => {return data}
    )

    if (isLoading) {
        return <CenteredCircularProgress/>
    }

    if(error) {
        return <FetchError error={error} />
    }

    if (Array.isArray(data?.result)) {
        if(data?.total > 0) {
            return <FlowLogs logs={data?.result}/>
        }
        return <NoData header="This profile has no logs."/>
    }

    return ""
}

export default ProfileLogDetails;

