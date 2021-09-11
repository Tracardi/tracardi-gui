import React, {useEffect, useState} from "react";
import {request} from "../../../remote_api/uql_api_endpoint";
import {connect} from "react-redux";
import {showAlert} from "../../../redux/reducers/alertSlice";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import LogsList from "../../flow/LogsList";

const ProfileLogDetails = ({eventId: profileId, showAlert}) => {

    const [logData, setLogData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        request({
                url: "/event/profile/" + profileId,
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

    }, [profileId, showAlert]);

    if(loading) {
        return <CenteredCircularProgress/>
    }

    return <LogsList logs={logData} />
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

