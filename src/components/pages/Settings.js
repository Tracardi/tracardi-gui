import React from "react";
import ListOfDottedInputs from "../elements/forms/ListOfDottedInputs";

export default function Settings() {
    return <ListOfDottedInputs onChange={(x)=>console.log(x)}/>
}