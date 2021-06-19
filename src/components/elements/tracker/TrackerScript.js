import React from "react";
import {CopyBlock, tomorrow} from "react-code-blocks";
// eslint-disable-next-line import/no-webpack-loader-syntax
import tracker from "!!raw-loader!./tracker.txt";

const TrackerScript = ({sourceId}) => {

    const trackerWithId = tracker.replace('<paste-your-source-id>', sourceId)
    return <CopyBlock
        text={trackerWithId}
        language="javascript"
        theme={tomorrow}
        codeBlock
    />;
}

export default React.memo(TrackerScript);