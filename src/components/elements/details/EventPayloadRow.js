import Chip from "@mui/material/Chip";
import JsonStringify from "../misc/JsonStingify";
import React from "react";

const EventPayloadRow = ({value}) => {
    return <div style={{padding: "10px 7px"}} className="flexLine"> {(value?.type !== "") ? <Chip label={value?.type} /> : <Chip label="ERROR" color="error"/> }<JsonStringify
        data={value.properties}
        disableToggle={true}
        style={{width: "auto", padding: 5}}
    /></div>
}

export default EventPayloadRow;