import React from "react";
import ListOfDottedInputs from "../elements/forms/ListOfDottedInputs";
import CopyTraitsForm from "../elements/forms/CopyTraitsForm";
import DottedPathInput from "../elements/forms/inputs/DottedPathInput";
import TimeInput from "../elements/forms/inputs/TimeInput";

export default function Settings() {
    return <>
        <TimeInput />
        <DottedPathInput value={"ala.kk"} onChange={(v)=>console.log(v)} forceMode={2} width={300}/>
        <ListOfDottedInputs onChange={(x)=>console.log(x)}/>
        <CopyTraitsForm onChange={(x)=>console.log(x)}/>
        </>
}