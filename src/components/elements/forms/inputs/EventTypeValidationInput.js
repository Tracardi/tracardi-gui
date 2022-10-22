import React from "react";
import Input from "./Input";


export default function EventTypeValidationInput({validationErrorMessage, value, onChange}) {

    const [jsonSchema, setJsonSchema] = React.useState(value?.jsonSchema ? JSON.stringify(validation.json_schema, null, '  ') : null);
    const [enabled, setEnabled] = React.useState(value?.enabled || false);
    const [condition, setCondition] = React.useState(value?.condition || "")

    const handleJsonSchemaChange = value => {
        setJsonSchema(value);
        if (onChange) {
            onChange({condition, enabled, jsonSchema: value});
        }
    }

    const handleEnabledChange = value => {
        setEnabled(value);
        if (onChange) {
            onChange({condition, enabled: value, jsonSchema});
        }
    }

    const handleConditionChange = value => {
        setCondition(value);
        if (onChange) {
            onChange({condition: value, enabled, jsonSchema});
        }
    }

    return <>
        <Input 
            label="Condition"
            initValue={condition}
            onChange={handleConditionChange}
        />

        <fieldset style={{borderColor: (validationErrorMessage) ? "red" : "#ccc"}}>
            <legend style={{color: (validationErrorMessage) ? "red" : "#aaa"}}>JSON-schema validation</legend>
            <JsonEditor value={jsonSchema} onChange={handleJsonSchemaChange}/>
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