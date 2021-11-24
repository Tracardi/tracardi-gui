import React, {useEffect, useState} from "react";
import {request} from "../../remote_api/uql_api_endpoint";
import {connect} from "react-redux";
import {showAlert} from "../../redux/reducers/alertSlice";
import "../elements/forms/JsonForm.css";
import KeyValueDesc from "../elements/misc/KeyValueDesc";
import CenteredCircularProgress from "../elements/progress/CenteredCircularProgress";

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

    return <form className="JsonForm" style={{height: "inherit", overflowY: "auto"}}>
        <div className="JsonFromGroup" style={{margin: 20}}>
            <div className="JsonFromGroupHeader">
                <h2>Settings</h2>
                <p>Use environment variables to set these settings.</p>
            </div>
            <section>
                {loading && <CenteredCircularProgress/>}
                {!loading && setting.map((row, index) => {
                    return <KeyValueDesc key={index} label={row.label} value={row.value} description={row.desc} />
                })}
            </section>
        </div>
    </form>
}

const mapProps = (state) => {
    return {}
}
export default connect(
    mapProps,
    {showAlert}
)(Settings)