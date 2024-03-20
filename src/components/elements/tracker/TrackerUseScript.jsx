import React from "react";
import {CopyBlock, tomorrow} from "react-code-blocks";
import raw from "raw.macro";

export default function TrackerUseScript() {
    const tracker = raw('./trackerUsage.txt');
    return <CopyBlock
        text={tracker}
        language="javascript"
        theme={tomorrow}
        codeBlock
    />;
}