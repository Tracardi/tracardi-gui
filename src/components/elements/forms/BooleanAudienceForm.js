import AudienceFilteringForm from "./AudienceFilteringForm";
import ListOfForms from "./ListOfForms";
import React from "react";

function Form(props) {
    return <div style={{margin: 20}}>
        <AudienceFilteringForm {...props}/>
    </div>
}

export default function BooleanAudienceForm() {
    return <ListOfForms form={AudienceFilteringForm} onChange={console.log} align="bottom"/>
}