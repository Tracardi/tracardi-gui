import React from "react";
import {NoPortData} from "./NoPortData";
import ConsoleView from "../elements/misc/ConsoleView";

export function DebugPortDetails({port}) {
    return <>
        <ConsoleView data={port?.value} label={"Port: " + port?.port}/>
        {!port?.value && <NoPortData/>}
    </>
}