import React, {useEffect, useState} from "react";
import {request} from "../../../remote_api/uql_api_endpoint";
import {connect} from "react-redux";
import {showAlert} from "../../../redux/reducers/alertSlice";
import {FlowProfiling} from "../../flow/FlowProfiling";
import {convertDebugInfoToProfilingData} from "../../flow/profilingConverter";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";

const EventProfilingDetails = ({eventId, showAlert}) => {

    const [profilingData, setProfilingData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        request({
                url: "/event/debug/" + eventId,
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
                    const profiling = convertDebugInfoToProfilingData(response.data);
                    setProfilingData(profiling);
                }
            })

    }, [eventId, showAlert]);

    if(loading) {
        return <CenteredCircularProgress/>
    }

    return <FlowProfiling profilingData={profilingData}/>
}
const mapProps = (state) => {
    return {
        notification: state.notificationReducer,
    }
};
export default connect(
    mapProps,
    {showAlert}
)(EventProfilingDetails)

