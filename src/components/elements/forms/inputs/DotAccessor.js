import {EvalInput, SourceInput} from "./EvalInput";
import React, {useCallback} from "react";
import EvalAutoComplete from "../EvalAutoComplete";
import {isString} from "../../../../misc/typeChecking";

export function ValueInput({
                               source, value: initValue, cast: initCast, onChange, disableCast = false,
                               fullWidth = false, filter=null
                           }) {

    const [value, setValue] = React.useState(initValue || "");
    const [cast, setCast] = React.useState(initCast || false);

    const handleChange = (value, castValue) => {
        if (!value) {
            value = ""
        }

        setValue(value);
        setCast(castValue)

        onChange(value, castValue)
    }

    const handleTyping = (value, castValue) => {
        if (!value) {
            value = ""
        }

        setValue(value);
        setCast(castValue)

        onChange(value, castValue)
    }

    if (source === "" || source === "payload" || source === "memory") {
        return <EvalInput
            style={{minWidth: 270}}
            value={value}
            autoCastValue={cast}
            disableCast={disableCast}
            onChange={(value, castValue) => handleChange(value, castValue)}/>
    } else {
        let url = `/storage/mapping/${source}/metadata`
        if(filter)
            url = url + "?filter="+filter
        return <EvalAutoComplete
            solo={true}
            autoCastValue={cast}
            fullWidth={fullWidth}
            disabled={false}
            url={url}
            initValue={value}
            disableCast={disableCast}
            onSetValue={(value, castValue) => handleChange(value?.id, castValue)}
            onChange={(value, castValue) => handleTyping(value?.id, castValue)}
            multiple={false}
        />
    }
}

export default function DotAccessor({
                                        label = "Reference", value: initValue = "",
                                        defaultSourceValue,
                                        defaultPathValue,
                                        onChange,
                                        error, errorMessage,
                                        forceMode = 2,
                                        lockSource = false,
                                        disableSwitching=false,
                                        disableCasting=false
                                    }) {

    const parseValue = useCallback((initValue) => {
        if (!initValue || initValue === "") {
            if (forceMode === 1) {
                return [defaultSourceValue ? defaultSourceValue : "payload", defaultPathValue ? defaultPathValue : "", false]
            }
            return [defaultSourceValue ? defaultSourceValue : "", defaultPathValue ? defaultPathValue : "", false]
        }

        let initCastValue = false

        if (initValue.startsWith("`") && initValue.endsWith("`")) {
            initCastValue = true
            initValue = initValue.trim("`")
            initValue = initValue.replace(/^`+/, '').replace(/`+$/, '');
        }

        const re = new RegExp("^(payload|profile|session|event|flow|memory)@");

        let [initSourceValue, initPathValue] = (isString(initValue) && initValue !== "")
            ? (initValue !== null && re.test(initValue) ? [initValue.split('@')[0], initValue.split('@').slice(1).join('@')]
                : ["", initValue]) : [defaultSourceValue, defaultPathValue];

        if (initSourceValue === "" && forceMode === 1) {
            initSourceValue = "payload"
        }

        return [initSourceValue, initPathValue, initCastValue]
    }, [defaultSourceValue, defaultPathValue, forceMode]);

    const [initSourceValue, initPathValue, initCastValue] = parseValue(initValue);

    const [castValue, setCastValue] = React.useState(initCastValue);
    const [dataSource, setDataSource] = React.useState(initSourceValue || "");
    const [pathValue, setPathValue] = React.useState(initPathValue || "");

    const handleNotationChange = (source, value, cast) => {
        if (onChange) {
            let dotNotation = value
            if (source !== "") {
                dotNotation = `${source}@${value}`
            }

            if (cast) {
                dotNotation = "`" + dotNotation + "`"
            }

            onChange(dotNotation);
        }
    }

    const handleSourceChange = (source) => {
        setDataSource(source)
        handleNotationChange(source, pathValue, castValue)
    }

    const handleValueChange = (value, cast) => {
        setCastValue(cast)
        setPathValue(value)
        handleNotationChange(dataSource, value, cast)
    }

    let fieldsetStyle = {display: "flex", padding: "0px 15px 5px", width: "fit-content", margin: 0, marginTop: -8}
    let textStyle = {}

    if (errorMessage) {
        fieldsetStyle = {...fieldsetStyle, borderColor: "#d81b60"}
        textStyle = {...textStyle, color: "#d81b60"}
    }

    return <>

        <fieldset style={fieldsetStyle}>
            <legend style={textStyle}>{label}</legend>
            <SourceInput value={dataSource}
                         onChange={handleSourceChange}
                         lock={lockSource}
                         lockValue={defaultSourceValue}
                         disableSwitching={disableSwitching}
            />
            <ValueInput
                source={dataSource}
                value={pathValue}
                cast={castValue}
                onChange={handleValueChange}
                disableCast={disableCasting}
            />
        </fieldset>
        {errorMessage && <div style={{paddingLeft: 10, paddingTop: 5, fontSize: 12, color: "#d81b60"}}>{errorMessage}</div>}
    </>
}
