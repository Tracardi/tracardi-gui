import Button from "../../elements/forms/Button";
import React, {useEffect, useState} from "react";
import './ConfigEditor.css';
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
import {objectMap} from "../../../misc/mappers";
import {BiError} from "react-icons/bi";

const ConfigEditor = ({config, manual, onConfig, errorMessages={}, confirmed = false}) => {

    const initConfig = JSON.stringify(config, null, '  ')
    const [eventPayload, setEventPayload] = useState(initConfig);
    const [parseErrors, setParseErrors] = useState({});
    const hasErrors = errorMessages && Object.keys(errorMessages).length

    useEffect(() => {
        setEventPayload(initConfig);
    }, [initConfig])

    const handleSubmit = (payload) => {
        try {
            if (onConfig) {
                onConfig(JSON.parse(payload));
            }
            setParseErrors({})
        } catch (e) {
            setParseErrors({message: e.toString()})
        }
    }

    const ErrorMessages = ({errors}) => {
        if (errors && Object.keys(errors).length){
            return <div>
                {objectMap(errors, (field, error) => {
                    return <div className="Error"><BiError size={20}
                                                           style={{marginRight: 8}}/> {`Field ${field}: ${error}`}</div>
                })}
            </div>
        }
        return ""
    }

    return <TuiForm className="ConfigEditor">
        <TuiFormGroup>
            <TuiFormGroupHeader header="JSON Configuration"/>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Advanced Plug-in Configuration"
                                   description="This is plugin configuration as JSON data. Use it with caution. Everything you type into
                        plug-in configuration form gets translated into this JSON.">
                    <fieldset style={{marginTop: 20}}>
                        <legend>JSON Configuration</legend>

                        <ErrorMessages errors={{...parseErrors, ...errorMessages}} />

                        <JsonEditor value={eventPayload}
                                    onChange={setEventPayload}
                        />
                    </fieldset>

                    <Button label="Save"
                            confirmed={confirmed}
                            error={hasErrors}
                            onClick={() => handleSubmit(eventPayload)}
                            style={{justifyContent: "center"}}
                    />

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

export default ConfigEditor;