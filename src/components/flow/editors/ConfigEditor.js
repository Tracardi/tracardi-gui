import Button from "../../elements/forms/Button";
import React, {useEffect, useState} from "react";
import '../ConfigEditor.css';
import {connect} from "react-redux";
import {showAlert} from "../../../redux/reducers/alertSlice";
import MdManual from "../actions/MdManual";
import JsonEditor from "../../elements/editors/JsonEditor";
import "../../elements/forms/JsonForm";
import {
    TuiForm,
    TuiFormGroup,
    TuiFormGroupContent,
    TuiFormGroupField,
    TuiFormGroupHeader
} from "../../elements/tui/TuiForm";

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

    return <TuiForm>
            <TuiFormGroup>
                <TuiFormGroupHeader header="JSON Configuration"/>
                <TuiFormGroupContent>
                    <TuiFormGroupField header="Advanced Plug-in Configuration"
                                       description="This is plugin configuration as JSON data. Use is with caution. Everything you type into
                        plug-in configuration form gets translated into this JSON.">
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
                    </TuiFormGroupField>
                </TuiFormGroupContent>
            </TuiFormGroup>

            {manual && <TuiFormGroup>
                    <TuiFormGroupHeader header="Plug-in Documentation"/>
                    <TuiFormGroupContent>
                        <MdManual mdFile={manual}/>
                    </TuiFormGroupContent>
            </TuiFormGroup>}

        </TuiForm>

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