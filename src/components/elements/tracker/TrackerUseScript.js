import React from "react";
import {CopyBlock, tomorrow} from "react-code-blocks";
// eslint-disable-next-line import/no-webpack-loader-syntax
import tracker from "!!raw-loader!./trackerUsage.txt";

export default function TrackerUseScript() {

    return <CopyBlock
        text={tracker}
        language="javascript"
        theme={tomorrow}
        codeBlock
    />;
}