import Button from "../../elements/forms/Button";
import React, {useEffect, useState} from "react";
import '../ConfigEditor.css';
import {connect} from "react-redux";
import {showAlert} from "../../../redux/reducers/alertSlice";
import MdManual from "../actions/MdManual";
import JsonEditor from "../../elements/misc/JsonEditor";

const ConfigEditor = ({showAlert, config, manual, onConfig}) => {

    const initConfig = JSON.stringify(config, null, '  ')
    const [eventPayload, setEventPayload] = useState(initConfig);
    const [saveEnabled, setSaveEnabled] = useState(true);

    useEffect(() => {
            setEventPayload(initConfig);
        }, [initConfig])

    const onConfigSave = (payload) => {
        try {
            if(onConfig) {
                onConfig(JSON.parse(payload));
                setSaveEnabled(false);
            }
        } catch(e) {
            showAlert({message: e.toString(), type: "error", hideAfter: 2000});
        }
    }

    const _setEventPayload = (d) => {
        setEventPayload(d);
        setSaveEnabled(true);
    }

    return <>
        <JsonEditor value={eventPayload}
                    onChange={(d) => _setEventPayload(d)}
                    />

        <div style={{display: "flex", margin: "10px 0"}}>
            <Button label="Save"
                    disabled={!saveEnabled}
                    onClick={() => onConfigSave(eventPayload)}/>
        </div>

        {manual && <MdManual mdFile={manual}/>}

    </>
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