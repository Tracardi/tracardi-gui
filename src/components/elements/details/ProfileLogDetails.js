import React, {useEffect, useState} from "react";
import {request} from "../../../remote_api/uql_api_endpoint";
import {connect} from "react-redux";
import {showAlert} from "../../../redux/reducers/alertSlice";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import FlowLogs from "../../flow/FlowLogs";

const ProfileLogDetails = ({profileId, sessionProfileId, showAlert}) => {

    const [logData, setLogData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let id = null;
        if(profileId === null || typeof profileId === 'undefined') {

            if(sessionProfileId !== null && typeof sessionProfileId !== 'undefined') {
                id = sessionProfileId
            }

            showAlert({message: "This event has no profile attached. That means the profile was deleted.", type: "warning", hideAfter: 4000});

        } else {
            id = profileId
        }

        if(id !== null) {
            setLoading(true);
            request({
                    url: "/profile/logs/" + id,
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
        }
    }, [profileId, sessionProfileId, showAlert]);

    if(loading) {
        return <CenteredCircularProgress/>
    }

    return <FlowLogs logs={logData} />
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

