import Paper from "@mui/material/Paper";
import EventPayloadForm from "./EventPayloadForm";
import ListOfForms from "./ListOfForms";
import EventPayloadRow from "../details/EventPayloadRow";
import React from "react";

const PaperEventPayloadForm = (props) => {
    return <Paper elevation={3} style={{padding: "10px 30px 30px 30px", margin: 3}}>
        <EventPayloadForm {...props}/>
    </Paper>
}

const ListOfEventPayloads = ({value, onChange}) => {
    return <ListOfForms form={PaperEventPayloadForm}
                        label="Add event"
                        defaultFormValue={{properties: {}, context: {}, type: ""}}
                        details={EventPayloadRow}
                        value={value}
                        onChange={onChange}/>
}

export default ListOfEventPayloads;