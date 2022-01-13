import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {showAlert} from "../../../redux/reducers/alertSlice";
import {FlowProfiling} from "../../flow/FlowProfiling";
import {convertDebugInfoToProfilingData} from "../../flow/profilingConverter";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import {asyncRemote} from "../../../remote_api/entrypoint";
import NoData from "../misc/NoData";

const EventProfilingDetails = ({eventId, showAlert}) => {

    const [profilingData, setProfilingData] = useState(null);
    const [loading, setLoading] = useState(false);

    const ListOfProfilingData = ({data}) => {
        if (Array.isArray(data)) {
            if(data.length>0) {
                return profilingData.map(
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

    useEffect(() => {
        let isSubscribed = true
        setLoading(true);
        asyncRemote({url: "/event/debug/" + eventId})
            .then((response) => {
                if (response !== null && isSubscribed) {
                    setProfilingData(response.data);
                }
            })
            .catch((e) => {
                if (e && isSubscribed) {
                    if (showAlert) {
                        showAlert({message: e[0].msg, type: "error", hideAfter: 4000});
                    } else {
                        alert(e[0].msg)
                    }
                }
            })
            .finally(() => {
                if(isSubscribed) {
                    setLoading(false)
                }
            })
        return () => isSubscribed = false
    }, [eventId, showAlert]);

    if (loading) {
        return <CenteredCircularProgress/>
    }

    return <ListOfProfilingData data={profilingData}/>
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

