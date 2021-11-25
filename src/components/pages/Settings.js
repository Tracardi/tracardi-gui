import React, {useEffect, useState} from "react";
import {request} from "../../remote_api/uql_api_endpoint";
import {connect} from "react-redux";
import {showAlert} from "../../redux/reducers/alertSlice";
import KeyValueDesc from "../elements/misc/KeyValueDesc";
import CenteredCircularProgress from "../elements/progress/CenteredCircularProgress";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupHeader} from "../elements/tui/TuiForm";

function Settings({showAlert}) {

    const [loading, setLoading] =useState(false);
    const [setting, setSettings] =useState([false]);

    useEffect(()=>{
        setLoading(true);
        request({
                method: "get",
                url: "/settings"
            },
            setLoading,
            (e) => {
                if (e) {
                    showAlert({message: e[0].msg, type: "error", hideAfter: 3000});
                }
            },
            (response) => {
                if (response) {
                    setSettings(response.data);
                }
            }
        )
    }, [showAlert])

    return <TuiForm style={{height: "inherit", overflowY: "auto"}}>
        <TuiFormGroup style={{margin: 20}}>
            <TuiFormGroupHeader header="Settings"
                                description="Use environment variables to set these settings."
            />
            <TuiFormGroupContent>
                {loading && <CenteredCircularProgress/>}
                {!loading && setting.map((row, index) => {
                    return <KeyValueDesc key={index} label={row.label} value={row.value} description={row.desc} />
                })}
            </TuiFormGroupContent>
        </TuiFormGroup>
    </TuiForm>
}

const mapProps = (state) => {
    return {}
}
export default connect(
    mapProps,
    {showAlert}
)(Settings)