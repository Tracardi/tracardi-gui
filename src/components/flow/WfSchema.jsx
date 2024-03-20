import React from "react";
import Warning from "../elements/misc/Warning";

const WfSchema = ({schema, style}) => {
    if(schema) {
        return <div style={style}>
            {schema?.uri} v. {schema?.version}
            {schema?.server_version!==schema?.version && <Warning version={schema?.server_version} message={"Incompatible backend version: " + schema?.server_version}/>}
        </div>
    }
    return ""
}

export default WfSchema;