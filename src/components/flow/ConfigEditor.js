import Button from "../elements/forms/Button";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-tomorrow";
import React, {useEffect, useState} from "react";
import './ConfigEditor.css';
import {connect} from "react-redux";
import {showAlert} from "../../redux/reducers/alertSlice";

const ConfigEditor = ({showAlert, config, onConfig}) => {

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
        <AceEditor
            mode="json"
            theme="tomorrow"
            fontSize={16}
            // onLoad={(d)=>console.log(d)}
            onChange={(d) => _setEventPayload(d)}
            name="payload_editor"
            value={eventPayload}
            editorProps={{$blockScrolling: true}}
            width="100%"
            height="260px"
        />
        <Button label="Save"
                disabled={!saveEnabled}
                className="SaveConfigButton"
                onClick={() => onConfigSave(eventPayload)}/>
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