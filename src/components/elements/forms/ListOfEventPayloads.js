import Paper from "@mui/material/Paper";
import EventPayloadForm from "./EventPayloadForm";
import ListOfForms from "./ListOfForms";
import EventPayloadRow from "../details/EventPayloadRow";
import React from "react";

const PaperEventPayloadForm = (props) => {
    return <Paper elevation={3} style={{padding: "10px 30px 30px 30px"}}>
        <EventPayloadForm {...props}/>
    </Paper>
}

const ListOfEventPayloads = ({value, onChange}) => {
    return <ListOfForms form={PaperEventPayloadForm}
                        defaultFormValue={{properties: {value:"", "ref": true}, context: {}, type: "page-view"}}
                        details={EventPayloadRow}
                        value={value}
                        onChange={onChange}/>
}

export default ListOfEventPayloads;