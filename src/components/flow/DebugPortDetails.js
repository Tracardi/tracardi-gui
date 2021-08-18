import React from "react";
import {NoPortData} from "./NoPortData";
import ConsoleView from "../elements/misc/ConsoleView";

export function DebugPortDetails({port, input}) {
    return <>
        {port?.value && <ConsoleView data={port?.value} label={"Port: " + port?.port}/>}
        {!port?.value && <NoPortData input={input}/>}
    </>
}