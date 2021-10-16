import React from "react";
import ListOfDottedInputs from "../elements/forms/ListOfDottedInputs";
import CopyTraitsForm from "../elements/forms/CopyTraitsForm";

export default function Settings() {
    return <>
        <ListOfDottedInputs onChange={(x)=>console.log(x)}/>
        <CopyTraitsForm onChange={(x)=>console.log(x)}/>
        </>
}