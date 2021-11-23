import React from "react";
import ListOfDottedInputs from "../elements/forms/ListOfDottedInputs";
import DottedPathInput from "../elements/forms/inputs/DottedPathInput";
import TimeInput from "../elements/forms/inputs/TimeInput";
import KeyValueForm from "../elements/forms/KeyValueForm";
import IconSelector from "../elements/IconSelector";

export default function TryOut() {
    return <>
        <IconSelector value="alert" onChange={(ic) => console.log(ic)}/>
        <KeyValueForm value={{kw:"value"}} onChange={(v)=>console.log(v)}/>
        <TimeInput />
        <DottedPathInput value={"ala.kk"} onChange={(v)=>console.log(v)} forceMode={2} width={300}/>
        <ListOfDottedInputs onChange={(x)=>console.log(x)}/>
        </>
}