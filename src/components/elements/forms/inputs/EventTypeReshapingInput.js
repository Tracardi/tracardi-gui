import React from "react";
import Input from "./Input";


export default function EventTypeReshapingInput({validationErrorMessage, value, onChange}) {
    
    const [template, setTemplate] = React.useState(value?.template ? JSON.stringify(validation.template, null, '  ') : null);
    const [enabled, setEnabled] = React.useState(value?.enabled || false);
    const [condition, setCondition] = React.useState(value?.condition || "")

    const handleTemplateChange = value => {
        setTemplate(value);
        if (onChange) {
            onChange({condition, enabled, template: value});
        }
    }

    const handleEnabledChange = value => {
        setEnabled(value);
        if (onChange) {
            onChange({condition, enabled: value, template});
        }
    }

    const handleConditionChange = value => {
        setCondition(value);
        if (onChange) {
            onChange({condition: value, enabled, template});
        }
    }

    return <>
        <Input 
            label="Condition"
            initValue={condition}
            onChange={handleConditionChange}
        />

        <fieldset style={{borderColor: (validationErrorMessage) ? "red" : "#ccc"}}>
            <legend style={{color: (validationErrorMessage) ? "red" : "#aaa"}}>Reshape template</legend>
            <JsonEditor value={template} onChange={handleTemplateChange}/>
        </fieldset>
        
        <FormControlLabel
            style={{marginLeft: 2}}
            control={
                <Checkbox
                    checked={enabled}
                    onChange={(e) => handleEnabledChange(e.target.checked)}
                    name="enable"
                    color="primary"
                />
            }
            label="Enable validation schema"
        />
        {validationErrorMessage && <div style={{color: "red"}}>{validationErrorMessage}</div>}
    </>
}