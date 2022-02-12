import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {showAlert} from "../../../redux/reducers/alertSlice";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import FlowLogs from "../../flow/FlowLogs";
import {asyncRemote} from "../../../remote_api/entrypoint";
import NoData from "../misc/NoData";

const ProfileLogDetails = ({profileId, sessionProfileId, showAlert}) => {

    const [logData, setLogData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let id = null;
        let isSubscribed = true
        if (profileId === null || typeof profileId === 'undefined') {

            if (sessionProfileId !== null && typeof sessionProfileId !== 'undefined') {
                id = sessionProfileId
            }

            showAlert({
                message: "This event has no profile attached. That means the profile was deleted.",
                type: "warning",
                hideAfter: 4000
            });

        } else {
            id = profileId
        }

        if (id !== null) {
            setLoading(true);
            asyncRemote({url: "/profile/logs/" + id})
                .then((response) => {
                    if (response !== null && isSubscribed) {
                        setLogData(response.data);
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
                    if (isSubscribed) {
                        setLoading(false)
                    }
                })
        }
        return () => isSubscribed = false
    }, [profileId, sessionProfileId, showAlert]);

    if (loading) {
        return <CenteredCircularProgress/>
    }

    if (Array.isArray(logData)) {
        if(logData.length > 0) {
            return <FlowLogs logs={logData}/>
        }
        return <NoData header="This event has no profile logs.">
            <p>Here is logged information on merging and segmentation errors.</p>
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
)(ProfileLogDetails)

