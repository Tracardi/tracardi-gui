import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {showAlert} from "../../../redux/reducers/alertSlice";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import FlowLogs from "../../flow/FlowLogs";
import NoData from "../misc/NoData";
import {asyncRemote, getError} from "../../../remote_api/entrypoint";

const EventLogDetails = ({eventId, showAlert}) => {

    const [logData, setLogData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        let isSubscribed = true;

        asyncRemote({
            url: "/event/logs/" + eventId + "?sort=desc",
        }).then((response) => {
            if(response && isSubscribed===true) {
                setLogData(response.data);
            }
        }).catch((e) => {
            if (e && isSubscribed === true) {
                const errors = getError(e)
                if (showAlert) {
                    showAlert({message: errors[0].msg, type: "error", hideAfter: 4000});
                } else {
                    alert(errors[0].msg)
                }
            }
        }).finally(() => {
            if(isSubscribed === true) setLoading(false);
        })
        return () => {
            isSubscribed = false
        }

    }, [eventId, showAlert]);

    if(loading) {
        return <CenteredCircularProgress/>
    }

    if (Array.isArray(logData?.result)) {
        if(logData?.total > 0) {
            return <FlowLogs logs={logData?.result}/>
        }
        return <NoData header="This event has no logs."/>
    }

    return ""
}
const mapProps = (state) => {
    return {
        notification: state.notificationReducer,
    }
};
export default connect(
    mapProps,
    {showAlert}
)(EventLogDetails)

