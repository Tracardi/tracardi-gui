import {VscLink} from "react-icons/vsc";
import {IoTextOutline} from "react-icons/io5";
import TextField from "@mui/material/TextField";
import React, {useState} from "react";
import {ValueInput} from "./DotAccessor";

export default function RefInput({
                                     fullWidth,
                                     style,
                                     value: _value = null,
                                     disabled,
                                     errorMessage = null,
                                     label,
                                     onChange,
                                     defaultType = false,
                                     locked = false,
                                     autocomplete = null,
                                     filter = null,
                                     width = "100%"
                                 }) {

    if (autocomplete) {
        defaultType = true
        locked = true
    }

    if (!_value) {
        _value = {
            value: "",
            ref: defaultType
        }
    }

    const [data, setData] = useState(_value)

    function getData() {
        return data || _value
    }

    function handleChange(value) {
        if (onChange instanceof Function) {
            onChange(value)
        }
    }

    function handleValueChange(v) {
        const _value = {...data, value: v}
        setData(_value)
        handleChange(_value)
    }

    function handleTypeChange(v) {
        if (!locked) {
            const _value = {...data, ref: v}
            setData(_value)
            handleChange(_value)
        }
    }

    let fieldsetStyle = {display: "flex", padding: "0px 15px 5px", width: "fit-content", margin: 0, marginTop:-8}
    let textStyle = {}

    if (errorMessage) {
        fieldsetStyle = {...fieldsetStyle, borderColor: "#d81b60"}
        textStyle = {...textStyle, color: "#d81b60"}
    }

    if(fullWidth) {
        fieldsetStyle = {...fieldsetStyle, width: width}
    }

    return <>
        <fieldset style={fieldsetStyle}>
            <legend style={textStyle}>{label}</legend>
            <div className="flexLine" style={{cursor: "pointer", width: "inherit", flexWrap: "nowrap"}}>
                {
                    getData()?.ref
                        ? <VscLink size={20} onClick={() => handleTypeChange(false)} style={{color: "gray", marginRight: 5}}/>
                        : <IoTextOutline size={20} onClick={() => handleTypeChange(true)} style={{color: "gray", marginRight: 5}}/>
                }
                {autocomplete
                    ? <ValueInput
                        source={autocomplete}
                        filter={filter}
                        value={getData()?.value}
                        fullWidth={fullWidth}
                        cast={false}
                        disabled={disabled}
                        disableCast={true}
                        onChange={(v) => handleValueChange(v)}/>
                    : <TextField
                        fullWidth={fullWidth}
                        size="small"
                        style={style}
                        value={getData()?.value}
                        onChange={(e) => handleValueChange(e.target.value)}
                        disabled={disabled}
                        variant="standard"
                    />}
            </div>

        </fieldset>

        {errorMessage &&
        <div style={{paddingLeft: 10, paddingBottom: 7, fontSize: 12, color: "#d81b60"}}>{errorMessage}</div>}
    </>
}

