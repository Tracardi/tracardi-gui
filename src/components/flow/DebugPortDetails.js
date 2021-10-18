import React from "react";
import {NoPortData} from "./NoPortData";
import ConsoleView from "../elements/misc/ConsoleView";

export function DebugPortDetails({port, input}) {
    return <>
        {port?.value !== null && <ConsoleView data={port?.value} label={"Port name: " + port?.port}/>}
        {port?.value === null && <NoPortData input={input} label={"Port name: " + port?.port}/>}
    </>
}