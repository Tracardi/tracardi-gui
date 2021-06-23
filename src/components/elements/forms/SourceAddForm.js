import {request} from "../../../remote_api/uql_api_endpoint";
import React from "react";
import SourceForm from "./SourceForm";
import {connect} from "react-redux";
import {showAlert} from "../../../redux/reducers/alertSlice";


const SourceAddForm = ({showAlert, init, onClose}) => {

    const onSourceSubmit = (payload) => {
        request({
                url: "/source",
                method: "post",
                data: payload
            },
            () => {
            },
            (e) => {
                if (e) {
                    showAlert({message: e[0].msg, type: "error", hideAfter: 2000});
                }
            },
            (data) => {
                if (data && onClose) {
                    onClose(data)
                }
            }
        )
    }

    return <SourceForm onSubmit={onSourceSubmit} init={init}/>
}

const mapProps = (state) => {
    return {
        notification: state.notificationReducer,
    }
};
export default connect(
    mapProps,
    {showAlert}
)(SourceAddForm)