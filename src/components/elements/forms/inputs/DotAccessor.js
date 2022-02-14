import {EvalInput, SourceInput} from "./EvalInput";
import React from "react";
import EvalAutoComplete from "../EvalAutoComplete";

export default function DotAccessor({label, value: initValue, errorMessage}) {

    const [source,setSource] = React.useState("");
    const [value,setValue] = React.useState(initValue || "");
    const [castValue,setCastValue] = React.useState(false);

    const handleSourceChange = (value) => {
        console.log("source", value)
        setSource(value)
    }

    const ValueInput = () => {

        const handleChange = (value, castValue) => {
            console.log("change",value, castValue)
            setValue(value);
            setCastValue(castValue)
        }

        const handleTyping = (value) => {
            console.log("typine", value)
        }

        if(source === "" || source === "payload") {
            return <EvalInput value={value} onChange={(e, castValue) => handleChange(e.target.value, castValue)}/>
        } else {
            const url = `/storage/mapping/${source}/metadata`
            return <EvalAutoComplete
                solo={true}
                autoCastValue={castValue}
                disabled={false}
                url={url}
                initValue={value}
                onSetValue={handleChange}
                onChange={handleTyping}
                multiple={false}
            />
        }
    }


    return <fieldset style={{display: "flex", padding: "0px 15px 7px", width: "fit-content"}}>
        <legend>{label}</legend>
        <SourceInput value={source} onChange={handleSourceChange}/>
        <ValueInput/>
    </fieldset>
}