import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {showAlert} from "../../../redux/reducers/alertSlice";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import FlowLogs from "../../flow/FlowLogs";
import NoData from "../misc/NoData";
import {getError} from "../../../remote_api/entrypoint";
import {useRequest} from "../../../remote_api/requestClient";

const NodeLogDetails = ({nodeId, showAlert}) => {

    const [logData, setLogData] = useState(null);
    const [loading, setLoading] = useState(false);

    const {request} = useRequest()

    useEffect(() => {
        setLoading(true);
        let isSubscribed = true;

        request({
            url: "/node/logs/" + nodeId + '?sort=desc',
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

    }, [nodeId, showAlert]);

    if(loading) {
        return <CenteredCircularProgress/>
    }

    if (Array.isArray(logData?.result)) {
        if(logData.total > 0) {
            return <FlowLogs logs={logData?.result} overflow="hidden"/>
        }
        return <NoData header="This node has no logs."/>
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
)(NodeLogDetails)

