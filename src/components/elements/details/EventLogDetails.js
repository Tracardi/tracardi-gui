import React, {useEffect, useState} from "react";
import {request} from "../../../remote_api/uql_api_endpoint";
import {connect} from "react-redux";
import {showAlert} from "../../../redux/reducers/alertSlice";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import FlowLogs from "../../flow/FlowLogs";
import NoData from "../misc/NoData";

const EventLogDetails = ({eventId, showAlert}) => {

    const [logData, setLogData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        request({
                url: "/event/logs/" + eventId,
            },
            setLoading,
            (e) => {
                if (e) {
                    if (showAlert) {
                        showAlert({message: e[0].msg, type: "error", hideAfter: 4000});
                    } else {
                        alert(e[0].msg)
                    }
                }
            },
            (response) => {
                if(response !== null) {
                    setLogData(response.data);
                }
            })

    }, [eventId, showAlert]);

    if(loading) {
        return <CenteredCircularProgress/>
    }

    if (Array.isArray(logData)) {
        if(logData.length > 0) {
            return <FlowLogs logs={logData}/>
        }
        return <NoData header="This event has no flow logs.">
            <p>Here is logged information on flow progress.</p>
        </NoData>
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

