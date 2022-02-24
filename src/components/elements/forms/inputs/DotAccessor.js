import {EvalInput, SourceInput} from "./EvalInput";
import React, {useCallback} from "react";
import EvalAutoComplete from "../EvalAutoComplete";
import {isString} from "../../../../misc/typeChecking";

const ValueInput = ({source, value: initValue, cast: initCast, onChange}) => {

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

    if (source === "" || source === "payload") {
        return <EvalInput
            style={{minWidth: 270}}
            value={value}
            autoCastValue={cast}
            onChange={(value, castValue) => handleChange(value, castValue)}/>
    } else {
        const url = `/storage/mapping/${source}/metadata`
        return <EvalAutoComplete
            solo={true}
            autoCastValue={cast}
            disabled={false}
            url={url}
            initValue={value}
            onSetValue={(value, castValue) => handleChange(value?.id, castValue)}
            onChange={(value, castValue) => handleTyping(value?.id, castValue)}
            multiple={false}
        />
    }
}

export default function DotAccessor({
                                        label="Reference", value: initValue = "",
                                        defaultSourceValue,
                                        defaultPathValue,
                                        onChange,
                                        error, errorMessage,
                                        forceMode = 2,
                                        lockSource=false
                                    }) {

    const parseValue = useCallback((initValue) => {
        if (!initValue || initValue === "") {
            if(forceMode === 1) {
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

        const re = new RegExp("^(payload|profile|session|event|flow)@");

        let [initSourceValue, initPathValue] = (isString(initValue) && initValue !== "")
            ? (initValue !== null && re.test(initValue) ? [initValue.split('@')[0], initValue.split('@').slice(1).join('@')]
                : ["", initValue]) : [defaultSourceValue, defaultPathValue];

        if(initSourceValue === "" && forceMode === 1) {
            initSourceValue = "payload"
        }

        return [initSourceValue, initPathValue, initCastValue]
    }, []);

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


    return <fieldset style={{display: "flex", padding: "0px 15px 7px", width: "fit-content", margin: 0}}>
        <legend>{label}</legend>
        <SourceInput value={dataSource}
                     onChange={handleSourceChange}
                     lock={lockSource}
                     lockValue={defaultSourceValue}
        />
        <ValueInput
            source={dataSource}
            value={pathValue}
            cast={castValue}
            onChange={handleValueChange}/>
    </fieldset>
}
