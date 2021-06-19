import {request} from "../../../remote_api/uql_api_endpoint";
import React, {useState} from "react";
import SourceForm from "./SourceForm";
import MysqlSourceConfigForm from "./MysqlSourceConfigForm";
import RecordAddedConfirmation from "./RecordAddedConfirmation";
import {connect} from "react-redux";
import {showAlert} from "../../../redux/reducers/alertSlice";

const SourceAddForm = ({showAlert, init}) => {

    const [source, setSource] = useState(null);
    const [type, setType] = useState(null);
    const [step, setStep] = useState(0);
    const [confirmation, setConfirmation] = useState({})

    const onSourceSubmit = (payload) => {
        setType(payload.type);
        setSource(payload)
        setStep(1)
    }

    const onConfigSubmit = (payload) => {
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
                    setStep(0)
                }
            },
            (data) => {
                if (data) {
                    setStep(2)
                    setConfirmation(payload)
                }
            }
        )
    }

    const getConfigForm = (type) => {
        switch (type) {
            case 'mysql':
                return <MysqlSourceConfigForm
                    source={source}
                    init={(init?.properties) ? init.properties : null}
                    onSubmit={onConfigSubmit}/>;
                break;
            default:
                onConfigSubmit(source);
        }
    }

    return <div>
        {step === 0 && <SourceForm onSubmit={onSourceSubmit} init={init}/>}
        {step === 1 && getConfigForm(type)}
        {step === 2 && <RecordAddedConfirmation payload={confirmation}/>}
    </div>
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