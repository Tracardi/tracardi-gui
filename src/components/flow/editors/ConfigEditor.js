import Button from "../../elements/forms/Button";
import React, {useEffect, useState} from "react";
import '../ConfigEditor.css';
import {connect} from "react-redux";
import {showAlert} from "../../../redux/reducers/alertSlice";
import MdManual from "../actions/MdManual";
import JsonEditor from "../../elements/editors/JsonEditor";
import "../../elements/forms/JsonForm";

const ConfigEditor = ({showAlert, config, manual, onConfig}) => {

    const initConfig = JSON.stringify(config, null, '  ')
    const [eventPayload, setEventPayload] = useState(initConfig);
    const [confirmedButton, setConfirmedButton] = useState(false);

    useEffect(() => {
        setEventPayload(initConfig);
    }, [initConfig])

    const onConfigSave = (payload) => {
        try {
            if (onConfig) {
                onConfig(JSON.parse(payload));
                setConfirmedButton(true);
            }
        } catch (e) {
            showAlert({message: e.toString(), type: "error", hideAfter: 2000});
        }
    }

    const _setEventPayload = (d) => {
        setEventPayload(d);
        setConfirmedButton(false);
    }

    return <form className="JsonForm">
            <div className="JsonFromGroup">
                <div className="JsonFromGroupHeader">
                    <h2>JSON Configuration</h2>
                </div>
                <section>
                    <h3>Advanced Plug-in Configuration</h3>
                    <div>This is plugin configuration as JSON data. Use is with caution. Everything you type into
                        plug-in configuration form gets translated into this JSON.</div>
                    <fieldset style={{marginTop:20}}>
                        <legend>JSON Configuration</legend>
                        <JsonEditor value={eventPayload}
                                    onChange={(d) => _setEventPayload(d)}
                        />
                    </fieldset>

                    <div style={{display: "flex", margin: "10px 0"}}>
                        <Button label="Save"
                                confirmed={confirmedButton}
                                onClick={() => onConfigSave(eventPayload)}/>
                    </div>
                </section>

            </div>

        {manual && <div className="JsonFromGroup">
                <div className="JsonFromGroupHeader">
                    <h2>Plug-in Documentation</h2>
                </div>
                <section>
                    <MdManual mdFile={manual}/>
                </section>
        </div>}

        </form>

}

const mapProps = (state) => {
    return {
        notification: state.notificationReducer,
    }
};

export default connect(
    mapProps,
    {showAlert}
)(ConfigEditor)