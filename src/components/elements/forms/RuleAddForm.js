import {request} from "../../../remote_api/uql_api_endpoint";
import React, {useState} from "react";
import RecordAddedConfirmation from "./RecordAddedConfirmation";
import {connect} from "react-redux";
import {showAlert} from "../../../redux/reducers/alertSlice";
import RuleForm from "./RuleForm";

const RuleAddForm = ({showAlert, init}) => {

    const [step, setStep] = useState(0);
    const [confirmation, setConfirmation] = useState({})

    const onRuleSubmit = (payload) => {
        request({
                url: "/rule",
                method: "post",
                data: payload
            },
            () => { },
            (e)=>{
                if(e) {
                    showAlert({message: e[0].msg, type: "error", hideAfter: 2000});
                }
            },
            (data) => {
                if(data) {
                    setConfirmation(payload)
                    setStep(1);
                }
            }
        )
    }


    return <div>
        {step === 0 && <RuleForm onSubmit={onRuleSubmit} init={init}/>}
        {step === 1 && <RecordAddedConfirmation payload={confirmation}/>}
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
)(RuleAddForm)