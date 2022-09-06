import React, {useState} from "react";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import Tabs, {TabCase} from "../tabs/Tabs";
import JsonEditor from "../editors/JsonEditor";
import HtmlEditor from "../editors/HtmlEditor";
import {objectMap} from "../../../misc/mappers";
import MenuItem from "@mui/material/MenuItem";
import ListOfDottedInputs from "./ListOfDottedInputs";
import KeyValueForm from "./KeyValueForm";
import CopyTraitsForm from "./CopyTraitsForm";
import ErrorLine from "../../errors/ErrorLine";
import SqlEditor from "../editors/SqlEditor";
import TuiSelectResource from "../tui/TuiSelectResource";
import {isEmptyStringOrNull} from "../../../misc/typeChecking";
import Chip from "@mui/material/Chip";
import TuiMultiSelectEventType from "../tui/TuiSelectMultiEventType";
import DotAccessor from "./inputs/DotAccessor";
import TuiSelectEventType from "../tui/TuiSelectEventType";
import TuiSelectMultiConsentType from "../tui/TuiSelectMultiConsentType";
import AutoComplete from "./AutoComplete";
import ReportConfigInput from "./inputs/ReportConfigInput";

export const TextInput = ({value, label, errorMessage, onChange}) => {

    const [text, setText] = useState(value || "")

    const handleChange = (event) => {
        event.preventDefault();
        setText(event.target.value);
        if (onChange) {
            onChange(event.target.value);
        }
    };

    return <TextField label={label}
                      value={text}
                      onChange={handleChange}
                      variant="outlined"
                      size="small"
                      helperText={errorMessage}
                      error={!isEmptyStringOrNull(errorMessage)}
                      FormHelperTextProps={{ style: { color: "#d81b60" }}}
                      fullWidth
    />
}

export function BoolInput({value, label, errorMessage, onChange}) {

    const [boolValue, setBoolValue] = useState(value || false);

    const handleChange = (value) => {
        setBoolValue(value);
        if (onChange) {
            onChange(value);
        }
    }

    return <div style={{display: "flex", alignItems: "center"}}>
        <Switch
            checked={boolValue}
            onChange={() => handleChange(!boolValue)}
            name="enabledSource"
            color={errorMessage ? "error" : "secondary"}
        />
        <span>{errorMessage ? <span style={{color: "red"}}>{errorMessage}</span> : label}</span>
    </div>
}

export function ContentInput({value, label, errorMessage, onChange, rows = 4, allowedTypes=["text/plain", "application/json", "text/html"]}) {

    const [textValue, setTextValue] = useState(value?.content || "");
    const [tab, setTab] = useState(allowedTypes.indexOf(value?.type) > -1 ? allowedTypes.indexOf(value?.type) : 0);

    const getContentType = (tab) => {
        return allowedTypes.length > tab ? allowedTypes[tab] : "text/plain";
    }

    let contentType = getContentType(tab)

    const handleTabChange = (tab) => {
        setTab(tab);
        contentType = getContentType(tab)
        handleChange(textValue)
    }

    const handleChange = (value) => {
        value = {
            type: contentType,
            content: value
        }
        setTextValue(value.content);
        if (onChange) {
            onChange(value);
        }
    }

    const getTabs = () => {
        let tabs = [];
        for (let value of allowedTypes) {
            if (value === "text/plain") tabs.push("Text");
            if (value === "application/json") tabs.push("JSON");
            if (value === "text/html") tabs.push("HTML");
        }
        return tabs;
    }

    return <><Tabs
        tabs={getTabs()}
        defaultTab={tab}
        onTabSelect={handleTabChange}
    >
        <TabCase id={allowedTypes.indexOf("text/plain") > -1 ? allowedTypes.indexOf("text/plain") : -1}>
            <div style={{marginTop: 10}}>
                <TextField label={label}
                           value={textValue}
                           onChange={(ev) => handleChange(ev.target.value)}
                           variant="outlined"
                           multiline
                           fullWidth
                           rows={rows}
                />
            </div>

        </TabCase>
        <TabCase id={allowedTypes.indexOf("application/json") > -1 ? allowedTypes.indexOf("application/json") : -2}>
            <fieldset style={{marginTop: 10}}>
                <legend>{label}</legend>
                <JsonEditor
                    value={textValue}
                    onChange={handleChange}
                />
            </fieldset>
        </TabCase>
        <TabCase id={allowedTypes.indexOf("text/html") > -1 ? allowedTypes.indexOf("text/html") : -3}>
            <fieldset style={{marginTop: 10}}>
                <legend>{label}</legend>
                <HtmlEditor
                    value={textValue}
                    onChange={handleChange}
                />
            </fieldset>
        </TabCase>
    </Tabs>
        {errorMessage && <span style={{color: "red"}}>{errorMessage}</span>}
    </>
}


export function SelectInput({value, values, label, errorMessage, items = [], errors, onChange}) {

    const [selectedItem, setSelectedItem] = useState(value || "");

    const handleChange = (ev) => {
        setSelectedItem(ev.target.value);
        if (onChange) {
            onChange(ev.target.value);
        }
        ev.preventDefault();
    }

    return <TextField select
                      label={label}
                      variant="outlined"
                      size="small"
                      helperText={errorMessage}
                      error={errorMessage}
                      FormHelperTextProps={{ style: { color: "#d81b60" }}}
                      value={selectedItem}
                      style={{minWidth: 150}}
                      onChange={handleChange}
    >
        {objectMap(items, (key, value) => (
            <MenuItem key={key} value={key}>
                {value}
            </MenuItem>
        ))}
    </TextField>
}

export function TextAreaInput({value, label, errorMessage, onChange = null}) {

    const [text, setText] = useState(value)

    const handleChange = (event) => {
        setText(event.target.value);
        event.preventDefault();
        if (onChange) {
            onChange(event.target.value);
        }
    };

    return <TextField label={label}
                      value={text}
                      onChange={handleChange}
                      helperText={errorMessage}
                      FormHelperTextProps={{ style: { color: "#d81b60" }}}
                      error={!isEmptyStringOrNull(errorMessage)}
                      variant="outlined"
                      multiline
                      fullWidth
                      rows={4}
    />
}

export function ListOfDotPaths({value, errorMessage, props, onChange = null}) {
    const handleSubmit = (value) => {
        if (onChange) {
            onChange(value);
        }
    }
    return <ListOfDottedInputs onChange={handleSubmit} errorMessage={errorMessage} value={value} {...props}/>
}

export function DotPathInput({value, props, errorMessage, onChange = null}) {

    const handleChange = (value) => {
        if (onChange) {
            onChange(value);
        }
    }

    return <DotAccessor value={value}
                        forceMode={1}
                        onChange={handleChange}
                        errorMessage={errorMessage}
                        {...props}/>
}

export function DotPathAndTextInput({value, props, errorMessage, onChange}) {

    const handleChange = (value) => {
        if (onChange) {
            onChange(value);
        }
    }

    return <DotAccessor value={value}
                        onChange={handleChange}
                        errorMessage={errorMessage}
                        {...props}
    />
}

export function KeyValueInput({value, values, props, onChange}) {

    const handleChange = (value, deleted) => {
        if (onChange) {
            onChange(value, deleted);
        }
    }

    return <KeyValueForm value={value}
                         values={values}
                         onChange={handleChange}
                         {...props}
    />
}

export function CopyTraitsInput({value, props, onChange}) {

    const handleChange = (value) => {
        if (onChange) {
            onChange(value);
        }
    }

    return <CopyTraitsForm value={value}
                           onChange={handleChange}
                           {...props}
    />
}

export function JsonInput({value, onChange = null}) {

    const getFormattedValue = (value) => {
        try {
            if (typeof value === 'string' && value.length > 0) {
                return [JSON.stringify(JSON.parse(value), null, '  '), null]
            }
            return [JSON.stringify(value, null, '  '), null]
        } catch (e) {
            return [value, e.toString()]
        }
    }

    const [formatedValue, error] = getFormattedValue(value);
    const [json, setJson] = useState(formatedValue);
    const [errorMsg, setErrorMsg] = useState(error);

    const handleChange = (value) => {
        // eslint-disable-next-line no-unused-vars
        const [formattedValue, error] = getFormattedValue(value)
        setJson(value);
        setErrorMsg(error)
        if (onChange) {
            onChange(value);
        }
    }

    React.useEffect(() => {
        handleChange(value);
    }, [value])

    return <>
        <fieldset style={{marginTop: 10}}>
            <legend>JSON</legend>
            <JsonEditor
                value={json}
                onChange={handleChange}
            />
        </fieldset>
        <div style={{height: 10}}>
            {errorMsg && <ErrorLine>{errorMsg}</ErrorLine>}
        </div>

    </>
}

export function SqlInput({value, onChange = null}) {

    const [sql, setSql] = useState(value)

    const handleChange = (value) => {
        setSql(value);
        if (onChange) {
            onChange(value);
        }
    }

    return <>
        <fieldset style={{marginTop: 10}}>
            <legend>SQL</legend>
            <SqlEditor
                value={sql}
                onChange={handleChange}
            />
        </fieldset>
    </>
}

export function ResourceSelect({value, errorMessage, onChange = null, tag = null, pro = false}) {

    const handleChange = (value) => {
        if(onChange instanceof Function) {
            onChange(value);
        }
    };

    return <TuiSelectResource initValue={value}
                              errorMessage={errorMessage}
                              onSetValue={handleChange}
                              tag={tag}
                              pro={pro}
    />
}

export function AutoCompleteInput({value, values, label, endpoint, error, defaultValueSet, onChange, onSetValue, onlyValueWithOptions=true}) {

    const handleChange = (value) => {
        if (onChange instanceof Function) {
            onChange(value);
        }
    };

    const handleSetValue = (value) => {
        if (handleSetValue instanceof Function) {
            onSetValue(value);
        }
    };

    return <AutoComplete
        onlyValueWithOptions={onlyValueWithOptions}
        placeholder={label}
        initValue={value ? value : null}
        defaultValueSet={defaultValueSet}
        error={error}
        endpoint={endpoint && {
            ...endpoint,
            data: values
        }}
        onChange={handleChange}
        onSetValue={handleSetValue}/>
}

export function EventTypes({value: initValue, onChange = null}) {

    const [value, setValue] = useState(initValue);

    const handleChange = (value) => {
        setValue(value);
        if (onChange instanceof Function) {
            onChange(value);
        }
    };

    return <TuiMultiSelectEventType value={value} label="Event types" onSetValue={handleChange} fullWidth={true}/>
}

export function EventType({value: initValue, errorMessage, onChange = null, props}) {

    const [value, setValue] = useState(initValue);

    const handleChange = (value) => {
        setValue(value);
        if (onChange instanceof Function) {
            onChange(value);
        }
    };

    return <TuiSelectEventType value={value}
                               label="Event type"
                               onSetValue={handleChange}
                               fullWidth={true}
                               errorMessage={errorMessage}
                               {...props}
    />
}

export function ConsentTypes({value: initValue, onChange = null}) {

    const [value, setValue] = useState(initValue);

    const handleChange = (value) => {
        setValue(value);
        if (onChange instanceof Function) {
            onChange(value);
        }
    };

    return <TuiSelectMultiConsentType value={value} label="Consent types" onSetValue={handleChange} fullWidth={true}/>
}

export function ReadOnlyTags({value}) {
    return Array.isArray(value) && value.map((tag, index) => <Chip label={tag} key={index} style={{marginLeft: 5}}/>)
}

export function ReportConfig({value: initValue, onChange, errorMessage, endpoint = null}) {
    
    const [value, setValue] = useState(initValue);
    const handleChange = value => {
        setValue(value);
        if (onChange instanceof Function) {
            onChange(value);
        }
    };

    return <ReportConfigInput value={value} onChange={handleChange} errorMessage={errorMessage} endpoint={endpoint}/>
}
