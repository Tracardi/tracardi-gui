import React from "react";
import {CopyBlock, tomorrow} from "react-code-blocks";
import raw from 'raw.macro';

const TrackerScript = ({sourceId}) => {
    const tracker = raw('./trackerLoader.txt');
    const trackerWithId = tracker.replace('<paste-your-source-id>', sourceId)
    return <CopyBlock
        text={trackerWithId}
        language="javascript"
        theme={tomorrow}
        codeBlock
    />;
}

export default React.memo(TrackerScript);